from django.urls import path
from .views import ClientRegisterView, GoogleOAuthView, MeView, PingView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("register/client/", ClientRegisterView.as_view(), name="register-client"),
    path("oauth/google/", GoogleOAuthView.as_view(), name="oauth-google"),
    path("me/", MeView.as_view(), name="me"),
    path("ping/", PingView.as_view(), name="ping"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]
