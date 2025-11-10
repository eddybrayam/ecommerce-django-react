# backend/payments/utils.py
from orders.models import Order, OrderItem
from django.core.mail import send_mail

def _create_order(usuario, productos):
    order = Order.objects.create(user=usuario)
    for p in productos:
        OrderItem.objects.create(
            order=order,
            product_id=p['id'],
            quantity=p['cantidad']
        )
    return order

def _send_order_email(usuario, order):
    # Mensaje base
    mensaje = f"Hola {usuario.username}, tu pedido ha sido recibido."

    # ✅ Agregar información del cupón si existe
    if hasattr(order, "coupon") and order.coupon:
        try:
            coupon = order.coupon
            descuento = getattr(order, "discount", 0)
            mensaje += f"\n\n🎟️ Cupón aplicado: {coupon.code}\nMonto con descuento: S/ {order.total:.2f}"
        except Exception as e:
            print(f"Error agregando cupón al correo: {e}")
    send_mail(
        subject=f"Pedido #{order.id} confirmado",
        message=f"Hola {usuario.username}, tu pedido ha sido recibido.",
        from_email="no-reply@tienda.com",
        recipient_list=[usuario.email],
        fail_silently=True
    )
