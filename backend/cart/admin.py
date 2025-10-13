from django.contrib import admin
from .models import Cart, CartItem

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "session_key", "is_active", "created_at", "updated_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("user__username", "session_key")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Información del carrito", {
            "fields": ("user", "session_key", "is_active")
        }),
        ("Tiempos de registro", {
            "fields": ("created_at", "updated_at"),
        }),
    )

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "product", "quantity", "added_at")
    list_filter = ("added_at",)
    search_fields = ("product__nombre", "cart__user__username")
    readonly_fields = ("added_at",)
    ordering = ("-added_at",)
    autocomplete_fields = ("cart", "product")
