from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        # Conecta la señal post_migrate para crear grupos por defecto
        from django.db.models.signals import post_migrate
        from .signals import create_default_groups
        post_migrate.connect(create_default_groups, sender=self)
