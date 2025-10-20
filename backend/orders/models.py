from django.db import models
from django.conf import settings
# Create your models here.
class Order (models.Model):
    STATUS_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("ENVIADO", "Enviado"),
        ("ENTREGADO", "Entregado"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDIENTE")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): return f"Order #{self.id} - {self.user}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # precio unitario capturado

    def line_total(self): return self.price * self.quantity

    def product_title(self):
        return getattr(self.product, "nombre", "")