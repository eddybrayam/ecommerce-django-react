# backend/cart/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet
from products.views import ProductViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")

cart_list = CartViewSet.as_view({"get": "list"})
cart_add = CartViewSet.as_view({"post": "add_item"})
cart_remove = CartViewSet.as_view({"post": "remove_item"})
cart_clear = CartViewSet.as_view({"post": "clear"})

urlpatterns = [
    path("", include(router.urls)),
    path("cart/", cart_list, name="cart-list"),
    path("cart/add_item/", cart_add, name="cart-add"),
    path("cart/remove_item/", cart_remove, name="cart-remove"),
    path("cart/clear/", cart_clear, name="cart-clear"),
]
