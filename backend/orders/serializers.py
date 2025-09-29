from rest_framework import serializers 
from .models import Cart, CartItem, Order, OrderItem, Payment, PaymentMethod
from accounts.serializers import UserSerializer
from catalog.serializers import ProductSerializer
from marketing.serializers import CouponSerializer

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    method = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = "__all__"

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    coupon = CouponSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    payment= PaymentSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = "__all__"

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta: 
        model = CartItem
        fields = "__all__"

class CartSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    class Meta: 
        model = Cart
        fields = "__all__"

