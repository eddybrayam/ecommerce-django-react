from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    name = models.CharField(max_length=30, unique=True)  # ADMIN, SELLER, CLIENT
    description = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="client")
    role = models.ForeignKey(Role, on_delete=models.PROTECT, related_name="clients")
    first_name = models.CharField("nombres", max_length=150)
    last_name = models.CharField("apellidos", max_length=150)
    address = models.CharField("direccion", max_length=255)
    dni = models.CharField(max_length=8, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.email})"


class GoogleAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="google_account")
    sub = models.CharField(max_length=255, unique=True)  # ID único de Google
    email = models.EmailField()
    picture = models.URLField(blank=True)
    given_name = models.CharField(max_length=150, blank=True)
    family_name = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} (Google)"

