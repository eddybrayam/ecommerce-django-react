from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Coupon, MarketingCampaign, Report, VisitStatistic, PurchaseStatistic

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'discount', 'start_date', 'end_date', 'active')
    search_fields = ('code',)
    list_filter = ('active',)

@admin.register(MarketingCampaign)
class MarketingCampaignAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'start_date', 'end_date', 'active')
    list_filter = ('active',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'generated_date', 'generated_by')

@admin.register(VisitStatistic)
class VisitStatisticAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'date', 'device')
    search_fields = ('user__first_name', 'product__name')

@admin.register(PurchaseStatistic)
class PurchaseStatisticAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'amount', 'date')
    search_fields = ('user__first_name', 'product__name')
