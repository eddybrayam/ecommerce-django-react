from django.urls import path
from .views import pagar_tarjeta_simulado, pagar_yape_simulado, pagar_orden_tarjeta_simulada

urlpatterns = [
    path("tarjeta/", pagar_tarjeta_simulado, name="pagar_tarjeta_simulado"),
    path("yape/", pagar_yape_simulado, name="pagar_yape_simulado"),
    path("orden/tarjeta/", pagar_orden_tarjeta_simulada, name="pagar_orden_tarjeta_simulada"),
]
