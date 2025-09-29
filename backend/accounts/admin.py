from django.contrib import admin
from .models import Role, Client, GoogleAccount, User, UserPreference,AssistantInteraction

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

# Agregar los modlees User, Preferene y Assistant
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'is_active')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('is_active', 'role')

@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'key', 'value', 'date')
    search_fields = ('user__first_name', 'key')
    list_filter = ('key',)

@admin.register(AssistantInteraction)
class AssistantInteractionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'command', 'response', 'date')
    search_fields = ('user__first_name', 'command')