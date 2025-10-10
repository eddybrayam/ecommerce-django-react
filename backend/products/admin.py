from django.contrib import admin
from django import forms
from .models import Product, Categoria


# 🧾 Formulario personalizado para mostrar mejor el campo JSON de imágenes
class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            "imagenes": forms.Textarea(attrs={
                "rows": 6,
                "cols": 80,
                "style": "font-family: monospace;",
                "placeholder": '[ "https://...", "https://..." ]'
            })
        }


# 🟦 Registro de Categorías
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "descripcion")
    search_fields = ("nombre",)


# 🟧 Registro de Productos
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ("producto_id", "nombre", "precio", "stock", "categoria", "activo")
    search_fields = ("nombre",)
    list_filter = ("activo", "categoria")
