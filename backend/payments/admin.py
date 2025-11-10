from django.contrib import admin
from .models import PagoSimulado, OrdenPagoSimulada, OrdenItem
from .models import PagoCupon

# 🧾 --- PAGOS INDIVIDUALES ---
@admin.register(PagoSimulado)
class PagoSimuladoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario",
        "producto",
        "monto",
        "metodo",
        "estado",
        "tarjeta_brand",
        "tarjeta_last4",
        "creado_en",
    )
    list_filter = ("metodo", "estado", "tarjeta_brand")
    search_fields = ("usuario__username", "producto__nombre", "tarjeta_last4")
    ordering = ("-creado_en",)
    readonly_fields = ("creado_en",)

    fieldsets = (
        ("Información del pago", {
            "fields": ("usuario", "producto", "monto", "metodo", "estado")
        }),
        ("Tarjeta (solo simulación)", {
            "fields": ("tarjeta_brand", "tarjeta_last4")
        }),
        ("Yape/Plin", {
            "fields": ("comprobante",)
        }),
        ("Tiempos", {
            "fields": ("creado_en",)
        }),
    )


# 🧩 --- ÍTEMS DE UNA ORDEN ---
class OrdenItemInline(admin.TabularInline):
    model = OrdenItem
    extra = 0
    readonly_fields = ("producto", "cantidad", "subtotal")
    can_delete = False


# 💰 --- ÓRDENES DE PAGO MÚLTIPLES ---
@admin.register(OrdenPagoSimulada)
class OrdenPagoSimuladaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario",
        "monto_total",
        "metodo",
        "estado",
        "creado_en",
    )
    list_filter = ("metodo", "estado")
    search_fields = ("usuario__username",)
    ordering = ("-creado_en",)
    readonly_fields = ("creado_en",)
    inlines = [OrdenItemInline]

    fieldsets = (
        ("Información de la orden", {
            "fields": ("usuario", "monto_total", "metodo", "estado")
        }),
        ("Tiempos", {
            "fields": ("creado_en",)
        }),
    )


@admin.register(PagoCupon)
class PagoCuponAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'cupon_usado', 'monto_original', 'monto_con_descuento', 'creado_en')
    search_fields = ('usuario__username', 'cupon_usado')
