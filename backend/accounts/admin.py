from django.contrib import admin
from .models import Role, Client, GoogleAccount

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = ("name",)

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "first_name", "last_name", "dni", "phone", "role", "created_at")
    search_fields = ("user__email", "first_name", "last_name", "dni", "phone")
    list_filter = ("role",)

@admin.register(GoogleAccount)
class GoogleAccountAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "email", "sub", "created_at")
    search_fields = ("email", "sub", "user__username")
