from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class PagoSimulado(models.Model):
    METODOS = [
        ("tarjeta", "Tarjeta"),
        ("yape", "Yape / Plin"),
    ]
    ESTADOS = [
        ("pendiente", "Pendiente"),
        ("aprobado", "Aprobado"),
        ("rechazado", "Rechazado"),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pagos_simulados")
    producto = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="pagos_simulados")
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    metodo = models.CharField(max_length=20, choices=METODOS)
    estado = models.CharField(max_length=20, choices=ESTADOS, default="pendiente")

    # Para Yape
    comprobante = models.ImageField(upload_to="pagos_simulados/", null=True, blank=True)

    # Para tarjeta
    tarjeta_last4 = models.CharField(max_length=4, blank=True, default="")
    tarjeta_brand = models.CharField(max_length=20, blank=True, default="")

    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago #{self.id} - {self.metodo} - {self.estado}"

class OrdenPagoSimulada(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ordenes_pago")
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo = models.CharField(max_length=20, choices=[("tarjeta", "Tarjeta"), ("yape", "Yape / Plin")])
    estado = models.CharField(max_length=20, choices=[("pendiente", "Pendiente"), ("aprobado", "Aprobado")], default="pendiente")
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Orden #{self.id} - {self.metodo} - {self.estado}"


class OrdenItem(models.Model):
    orden = models.ForeignKey(OrdenPagoSimulada, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Product, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"


class PagoCupon(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    productos = models.TextField()  # Ej: "Laptop ASUS, Mouse Gamer"
    cupon_usado = models.CharField(max_length=50)
    monto_original = models.DecimalField(max_digits=12, decimal_places=2)
    monto_con_descuento = models.DecimalField(max_digits=12, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago con cupón #{self.id} - {self.usuario.username}"
