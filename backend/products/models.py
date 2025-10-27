from django.db import models
from django.utils import timezone
import json
from django.utils.translation import gettext_lazy as _
from django.contrib.admin import SimpleListFilter

class Marca(models.Model):
    nombre = models.CharField(max_length=100)
    def __str__(self):
        return self.nombre

class PriceRangeFilter(SimpleListFilter):
    title = _('Rango de precio')
    parameter_name = 'precio_rango'

    def lookups(self, request, model_admin):
        return [
            ('0-499', _('S/ 0 - 499')),
            ('500-999', _('S/ 500 - 999')),
            ('1000-1999', _('S/ 1000 - 1999')),
            ('2000+', _('S/ 2000 o más')),
        ]

    def queryset(self, request, queryset):
        value = self.value()
        if value == '0-499':
            return queryset.filter(precio__lt=500)
        elif value == '500-999':
            return queryset.filter(precio__gte=500, precio__lt=1000)
        elif value == '1000-1999':
            return queryset.filter(precio__gte=1000, precio__lt=2000)
        elif value == '2000+':
            return queryset.filter(precio__gte=2000)
        return queryset

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


# 🟨 NUEVO MODELO: CUPONES
class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percent = models.PositiveIntegerField(default=0)  # ejemplo: 10 = 10%
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)
    min_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def is_valid(self):
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to

    def __str__(self):
        return f"{self.code} ({self.discount_percent}%)"
