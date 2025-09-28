from django.db import migrations

def seed_roles(apps, schema_editor):
    Role = apps.get_model("accounts", "Role")
    defaults = {
        "ADMIN": "Administrador del sistema",
        "SELLER": "Vendedor",
        "CLIENT": "Cliente",
    }
    for name, desc in defaults.items():
        Role.objects.get_or_create(name=name, defaults={"description": desc})

class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_role_googleaccount_client_delete_profile"),
    ]

    operations = [
        migrations.RunPython(seed_roles, migrations.RunPython.noop),
    ]
