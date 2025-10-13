from django.contrib import admin
from django import forms
from .models import Product, Categoria, Marca

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

# 🟢 Filtro personalizado por rango de precios
class PriceRangeFilter(admin.SimpleListFilter):
    title = 'Rango de precios'  # Título en el panel derecho
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

# 🟧 Registro de Productos con filtros avanzados
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ("producto_id", "nombre", "precio", "stock", "categoria", "activo")
    search_fields = ("nombre",)
    list_filter = ("activo", "categoria", PriceRangeFilter)
    ordering = ("precio",)  # 👈 Permite ordenar por precio
    list_per_page = 10      # 👈 Paginación en el admin
    list_filter = ("activo", "categoria", PriceRangeFilter)  # 👈 Debe estar así

# 🟪 Registro de Marcas
@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)
