from rest_framework import serializers 
from .models import Favorite, Recommendation, Review
from accounts.serializers import UserSerializer
from catalog.serializers import ProductSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only= True)
    product = ProductSerializer(read_only = True)
    class Meta: 
        model = Favorite
        fields = "__all__"

class RecommendationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    product = ProductSerializer(read_only = True)
    class Meta:
        model = Recommendation
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    product = ProductSerializer(read_onl = True)
    class Meta:
        model = Review
        fields = "__all__"