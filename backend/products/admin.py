from django.contrib import admin
from django import forms
from .models import Product, Categoria, Marca, Review, Coupon  # 🟢 Agregamos Coupon

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

# --- Filtro personalizado por rango de precio ---
class PriceRangeFilter(admin.SimpleListFilter):
    title = 'Rango de precios'  # Título que aparecerá en el panel
    parameter_name = 'precio_rango'

    def lookups(self, request, model_admin):
        return [
            ('<500', 'Menos de S/ 500'),
            ('500-1000', 'Entre S/ 500 y S/ 1000'),
            ('1000-2000', 'Entre S/ 1000 y S/ 2000'),
            ('>2000', 'Más de S/ 2000'),
        ]

    def queryset(self, request, queryset):
        value = self.value()
        if value == '<500':
            return queryset.filter(precio__lt=500)
        if value == '500-1000':
            return queryset.filter(precio__gte=500, precio__lte=1000)
        if value == '1000-2000':
            return queryset.filter(precio__gte=1000, precio__lte=2000)
        if value == '>2000':
            return queryset.filter(precio__gt=2000)
        return queryset


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

admin.site.register(Marca)


# 🟧 NUEVO: Admin para reseñas
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("producto", "usuario", "calificacion", "creado_en", "actualizado_en")
    list_filter = ("calificacion", "creado_en")
    search_fields = ("producto__nombre", "usuario__username", "comentario")
    readonly_fields = ("creado_en", "actualizado_en")


# 🟩 NUEVO: Admin para cupones
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_percent", "valid_from", "valid_to", "active")
    list_filter = ("active", "valid_from", "valid_to")
    search_fields = ("code",)
