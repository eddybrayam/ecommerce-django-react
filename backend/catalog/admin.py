from django.contrib import admin

from .models import Category, Product, StockHistory

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'stock', 'active', 'created_at')
    search_fields = ('name',)
    list_filter = ('category', 'active')

@admin.register(StockHistory)
class StockHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'quantity', 'type', 'date')
    search_fields = ('product__name',)
    list_filter = ('type',)
