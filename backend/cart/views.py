from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer
from rest_framework import serializers


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class CartViewSet(viewsets.ViewSet):
    """Enhanced Cart API"""

    def _get_cart(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key or request.session.create() or request.session.session_key

        if user:
            cart, _ = Cart.objects.get_or_create(user=user, is_active=True)
        else:
            cart, _ = Cart.objects.get_or_create(session_key=session_key, is_active=True)
        return cart

    def list(self, request):
        cart = self._get_cart(request)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def add_item(self, request):
        cart = self._get_cart(request)
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = get_object_or_404(Product, pk=serializer.validated_data["product_id"], activo=True)
        quantity = serializer.validated_data["quantity"]

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def remove_item(self, request):
        cart = self._get_cart(request)
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "product_id required"}, status=status.HTTP_400_BAD_REQUEST)
        CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"])
    def clear(self, request):
        cart = self._get_cart(request)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)
