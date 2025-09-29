from django.contrib import admin
from .models import Return, Complaint

@admin.register(Return)
class ReturnAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'user', 'date', 'status')
    search_fields = ('product__name', 'user__username', 'order__id')
    list_filter = ('status',)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order', 'date', 'status')
    search_fields = ('user__username', 'order__id')
    list_filter = ('status',)