from django.contrib import admin

from .models import Cart, CartItem, Order, OrderItem, Payment, PaymentMethod

# Cart y CartItem
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'is_active')
    search_fields = ('user__username',)
    list_filter = ('is_active',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'subtotal')
    search_fields = ('product__name',)
    list_filter = ('cart',)

# Order y OrderItem
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order_date', 'status', 'total')
    search_fields = ('user__username',)
    list_filter = ('status',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'unit_price', 'subtotal')
    search_fields = ('product__name',)
    list_filter = ('order',)

# Payment y PaymentMethod
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'method', 'amount', 'payment_date', 'status')
    search_fields = ('order__id', 'method__name')
    list_filter = ('status', 'method')

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active')
    search_fields = ('name',)
    list_filter = ('is_active',)
