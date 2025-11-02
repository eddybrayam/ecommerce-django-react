from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.contrib.auth.models import User
from products.models import Product
from .models import PagoSimulado, OrdenPagoSimulada, OrdenItem
from .serializers import PagoSimuladoSerializer

from orders.models import Order, OrderItem
from decimal import Decimal
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.decorators import permission_classes
from products.models import Coupon
# 🧠 Detectar marca de tarjeta (simulado)
def detectar_brand(numero):
    if not numero:
        return ""
    if str(numero).startswith(("4",)):
        return "VISA"
    if str(numero).startswith(("51", "52", "53", "54", "55")):
        return "Mastercard"
    return "Desconocida"


# 💳 PAGO SIMULADO CON TARJETA (1 solo producto)
@api_view(["POST"])
def pagar_tarjeta_simulado(request):
    try:
        usuario = request.user if request.user.is_authenticated else User.objects.first()
        if not usuario:
            return Response({"error": "No existe usuario"}, status=400)

        producto_id = request.data.get("producto_id")
        monto = request.data.get("monto")
        tarjeta_numero = request.data.get("tarjeta_numero")
        tarjeta_mes = request.data.get("tarjeta_mes")
        tarjeta_anio = request.data.get("tarjeta_anio")
        tarjeta_cvc = request.data.get("tarjeta_cvc")

        if not all([producto_id, monto, tarjeta_numero, tarjeta_mes, tarjeta_anio, tarjeta_cvc]):
            return Response({"error": "Faltan campos obligatorios"}, status=400)

        producto = Product.objects.get(pk=producto_id)
        if producto.stock <= 0:
            return Response({"error": "Sin stock disponible"}, status=400)

        # Simular aprobación de pago
        last4 = str(tarjeta_numero)[-4:]
        brand = detectar_brand(tarjeta_numero)

        pago = PagoSimulado.objects.create(
            usuario=usuario,
            producto=producto,
            monto=monto,
            metodo="tarjeta",
            estado="aprobado",
            tarjeta_last4=last4,
            tarjeta_brand=brand,
        )

        # 🔻 Descontar stock
        producto.stock -= 1
        producto.save()

        return Response({
            "mensaje": "Pago con tarjeta SIMULADO aprobado y stock actualizado",
            "pago": PagoSimuladoSerializer(pago).data
        }, status=201)

    except Product.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# 📱 PAGO CON YAPE (sube imagen)
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def pagar_yape_simulado(request):
    try:
        usuario = request.user if request.user.is_authenticated else User.objects.first()
        producto_id = request.data.get("producto_id")
        monto = request.data.get("monto")
        comprobante = request.FILES.get("comprobante")

        if not all([producto_id, monto, comprobante]):
            return Response({"error": "Faltan campos: producto_id, monto y comprobante"}, status=400)

        producto = Product.objects.get(pk=producto_id)

        pago = PagoSimulado.objects.create(
            usuario=usuario,
            producto=producto,
            monto=monto,
            metodo="yape",
            estado="pendiente",
            comprobante=comprobante,
        )

        # 🔻 Descontar stock al registrar el pago pendiente
        if producto.stock > 0:
            producto.stock -= 1
            producto.save()

        return Response({
            "mensaje": "Pago Yape SIMULADO recibido y stock actualizado",
            "pago": PagoSimuladoSerializer(pago).data
        }, status=201)

    except Product.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# 💰 PAGO DE VARIOS PRODUCTOS EN UNA ORDEN
@api_view(["POST"])
def pagar_orden_tarjeta_simulada(request):
    """
    {
      "productos": [
        {"id": 1, "cantidad": 2},
        {"id": 2, "cantidad": 1}
      ],
      "tarjeta_numero": "4242424242424242",
      "tarjeta_mes": "12",
      "tarjeta_anio": "2028",
      "tarjeta_cvc": "123"
    }
    """
    try:
        usuario = request.user if request.user.is_authenticated else User.objects.first()
        data = request.data
        productos = data.get("productos", [])
        if not productos:
            return Response({"error": "No se enviaron productos"}, status=400)

        # Validación básica de tarjeta
        if len(str(data.get("tarjeta_numero", ""))) < 12:
            return Response({"error": "Número de tarjeta inválido"}, status=400)

        monto_total = 0
        items_creados = []

        for item in productos:
            prod = Product.objects.get(pk=item["id"])
            cantidad = int(item.get("cantidad", 1))
            if prod.stock < cantidad:
                return Response({"error": f"Stock insuficiente para {prod.nombre}"}, status=400)
            
            subtotal = float(prod.precio) * cantidad
            monto_total += subtotal
            items_creados.append((prod, cantidad, subtotal))

        # Crear la orden principal
        orden = OrdenPagoSimulada.objects.create(
            usuario=usuario,
            monto_total=monto_total,
            metodo="tarjeta",
            estado="aprobado"
        )

        # Crear ítems y descontar stock
        for prod, cantidad, subtotal in items_creados:
            OrdenItem.objects.create(
                orden=orden,
                producto=prod,
                cantidad=cantidad,
                subtotal=subtotal
            )
            prod.stock -= cantidad
            prod.save()  # 🔻 Descuento de stock

        return Response({
            "mensaje": "Pago de orden SIMULADO aprobado y stock actualizado",
            "orden_id": orden.id,
            "monto_total": monto_total,
            "estado": orden.estado,
            "items": [
                {
                    "producto": i.producto.nombre,
                    "cantidad": i.cantidad,
                    "subtotal": i.subtotal
                } for i in orden.items.all()
            ]
        }, status=201)

    except Product.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)




def _create_order(user, items):
    """
    items = [{"id": product_id, "cantidad": n, "price": opcional}]
    """
    order = Order.objects.create(user=user, total=Decimal("0.00"))
    total = Decimal("0.00")
    for it in items:
        p = Product.objects.get(pk=it["id"])
        price = Decimal(str(p.precio))  
        qty = int(it["cantidad"])
        OrderItem.objects.create(order=order, product=p, quantity=qty, price=price)
        total += price * qty
    order.total = total
    order.save(update_fields=["total"])
    return order


def _send_order_email(user, order):
    html = render_to_string("emails/order_summary.html", {"order": order, "user": user})
    msg = EmailMultiAlternatives(
        subject=f"Resumen de tu pedido #{order.id}",
        body=f"Gracias por tu compra. Total S/ {order.total}",
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        to=[user.email],
    )
    msg.attach_alternative(html, "text/html")
        # 🟢 Agregar información del cupón (si existe)
    if hasattr(order, "coupon") and order.coupon:
        try:
            coupon = order.coupon
            descuento = getattr(order, "discount", 0)
            msg.body += f"\n\n🎟️ Cupón aplicado: {coupon.code}\nDescuento: S/ {descuento:.2f}"
        except Exception as e:
            print(f"Error agregando cupón al correo: {e}")
    msg.send(fail_silently=True)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirmar_pago_y_crear_pedido(request):
    """
    Endpoint genérico para tu pago con tarjeta/Yape.
    Espera: {"productos":[{"id":1,"cantidad":2}, ...]}
    """
    productos = request.data.get("productos", [])
    if not productos:
        return Response({"error": "Productos vacíos"}, status=400)
    order = _create_order(request.user, productos)
    _send_order_email(request.user, order)
    return Response({"mensaje": "Pago confirmado y pedido creado", "order_id": order.id})

# backend/products/views_coupon.py  o  backend/orders/views.py
@api_view(['POST'])
def apply_coupon(request):
    code = request.data.get('code')
    order_id = request.data.get('order_id')
    order = Order.objects.get(id=order_id)
    coupon = Coupon.objects.filter(code=code, active=True).first()

    if not coupon:
        return Response({'error': 'Cupón inválido o vencido'}, status=400)

    descuento = (coupon.discount_percent / 100) * order.total
    order.discount = descuento
    order.total -= descuento
    order.coupon = coupon  # 🟢 Guarda el cupón en la orden
    order.save()

    return Response({
        'message': 'Cupón aplicado',
        'discount_applied': True,
        'new_total': order.total
    })