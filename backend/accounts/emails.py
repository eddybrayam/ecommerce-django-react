from django.core.mail import send_mail
from django.conf import settings

def send_activation_email(user, activation_link):
    subject = "Activa tu cuenta"
    message = f"Hola {user.username},\n\nActiva tu cuenta usando el siguiente enlace:\n{activation_link}\n\nGracias."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)
