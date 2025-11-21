"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# ✅ Importación para el endpoint de cupones
from products.views_coupon import validate_coupon
urlpatterns = [
    path("admin/", admin.site.urls),

    # Endpoints JWT
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Endpoints de accounts
    path("api/accounts/", include("accounts.urls", namespace="accounts")),

    path('api/', include('products.urls')),
    path("api/pagos/", include("payments.urls")),

    #correo con pedido
    path("api/", include("orders.urls")),
    path("api/", include("payments.urls")),

    #categorias filtros
    path('api/', include('products.urls')),
    
    # ✅ Nueva ruta para validar cupones
    path("api/coupon/", validate_coupon, name="validate-coupon"),

    #URLS DE SIPORTE DE CONTACTO
    path('support/', include('support.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
