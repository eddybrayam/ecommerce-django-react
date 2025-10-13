from django.db import models
from django.utils import timezone
import json

class Marca(models.Model):
    nombre = models.CharField(max_length=100)
    def __str__(self):
        return self.nombre

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.nombre


class Product(models.Model):
    producto_id = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="productos")
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    imagen_url = models.URLField(max_length=255, blank=True, null=True)
    imagenes = models.TextField(blank=True, null=True)  # URLs antiguas o JSON
    fecha_creacion = models.DateTimeField(default=timezone.now)
    activo = models.BooleanField(default=True)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, null=True, blank=True)

    # 🟩 NUEVO: campo para una imagen principal subida
    imagen_principal = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} ({'Agotado' if self.stock <= 0 else 'Disponible'})"

    def get_imagenes(self):
        if not self.imagenes:
            return []
        try:
            data = json.loads(self.imagenes)
            return data if isinstance(data, list) else []
        except Exception:
            return []


# 🟦 NUEVO modelo para varias imágenes subidas desde el sistema
class ImagenProducto(models.Model):
    producto = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='imagenes_extra')
    imagen = models.ImageField(upload_to='products/')

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"
