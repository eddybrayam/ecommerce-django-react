from django.contrib.auth.models import Group
from django.db import transaction

def create_default_groups(sender, **kwargs):
    # Se ejecuta después de migrate; idempotente
    with transaction.atomic():
        for name in ("ADMIN","VENDEDOR","CLIENTE"):
            Group.objects.get_or_create(name=name)