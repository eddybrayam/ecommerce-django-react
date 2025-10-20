from django.contrib import admin

# Register your models here.

from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product","quantity","price")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id","user","total","status","created_at")
    list_filter = ("status","created_at")
    inlines = [OrderItemInline]