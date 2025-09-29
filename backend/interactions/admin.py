from django.contrib import admin
from .models import Favorite, Recommendation, Review

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'added_date')
    search_fields = ('user__first_name', 'product__name')

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'source', 'date')
    search_fields = ('user__first_name', 'product__name')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'rating', 'approved', 'date')
    search_fields = ('user__first_name', 'product__name')
    list_filter = ('approved',)
