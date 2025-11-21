from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from django.conf import settings

@csrf_exempt
def support_contact(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"detail": "JSON inválido"}, status=400)

    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")
    order_code = data.get("order_code")

    if not all([name, email, subject, message]):
        return JsonResponse({"detail": "Faltan datos obligatorios."}, status=400)

    admin_subject = f"[SOPORTE] {subject} - {name}"

    body = (
        f"Nombre: {name}\n"
        f"Correo del usuario: {email}\n"
        f"Código de pedido: {order_code or 'No indicado'}\n\n"
        f"Mensaje:\n{message}"
    )

    try:
        mail = EmailMessage(
            subject=admin_subject,
            body=body,
            from_email=settings.EMAIL_HOST_USER,   # 🔥 CORREGIDO
            to=[settings.SUPPORT_EMAIL],           # 🔥 LLEGA AL ADMIN
        )
        mail.content_subtype = "plain"
        mail.charset = "utf-8"
        mail.send()
    except Exception as e:
        return JsonResponse({"detail": f"Error al enviar el correo: {str(e)}"}, status=500)

    return JsonResponse({"detail": "Mensaje enviado correctamente."}, status=200)
