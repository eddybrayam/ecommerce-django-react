from django.db import models
from django.utils import timezone
import json

# 🟦 Tabla de Categorías
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


# 🟧 Tabla de Productos
class Product(models.Model):
    producto_id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="productos")  # ✅ relación correcta
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    imagen_url = models.URLField(max_length=255, blank=True, null=True)
    imagenes = models.TextField(blank=True, null=True)  # JSON con URLs adicionales
    fecha_creacion = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)

    @property
    def estado_stock(self):
        return "Agotado" if self.stock <= 0 else "Disponible"

    def get_imagenes(self):
        if not self.imagenes:
            return []
        try:
            data = json.loads(self.imagenes)
            return data if isinstance(data, list) else []
        except Exception:
            return []

    def __str__(self):
        return f"{self.nombre} ({self.estado_stock})"
