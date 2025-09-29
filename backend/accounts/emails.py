from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth import get_user_model

from .tokens import email_verification_token

User = get_user_model()


def build_verify_link(request, user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token.make_token(user)

    # Si definiste FRONTEND_URL y quieres que el front maneje la verificación:
    if getattr(settings, "FRONTEND_URL", None):
        return f"{settings.FRONTEND_URL}/verify-email?uid={uidb64}&token={token}"

    # Caso contrario, generamos link hacia el backend
    base = getattr(settings, "SITE_DOMAIN", None)
    if not base and request:
        base = request.build_absolute_uri("/").rstrip("/")
    if not base:
        base = "http://127.0.0.1:8000"  # fallback por si no hay request ni SITE_DOMAIN

    path = reverse("accounts:verify-email", kwargs={"uidb64": uidb64, "token": token})
    return f"{base}{path}"


def send_verification_email(request, user: User):
    verify_link = build_verify_link(request, user)
    subject = "Verifica tu correo - TechStore Pro"
    text_body = (
        f"Hola {user.first_name or ''},\n\n"
        f"Gracias por registrarte. Verifica tu correo haciendo clic en el siguiente enlace:\n"
        f"{verify_link}\n\n"
        f"Si no creaste esta cuenta, ignora este mensaje."
    )
    html_body = f"""
    <p>Hola <strong>{user.first_name or ''}</strong>,</p>
    <p>Gracias por registrarte. Verifica tu correo haciendo clic en el siguiente enlace:</p>
    <p><a href="{verify_link}">{verify_link}</a></p>
    <p>Si no creaste esta cuenta, ignora este mensaje.</p>
    """
    send_mail(
        subject=subject,
        message=text_body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        recipient_list=[user.email],
        html_message=html_body,
        fail_silently=False,
    )
