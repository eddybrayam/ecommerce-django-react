from rest_framework import serializers 
from .models import Coupon, MarketingCampaign, Report, VisitStatistic,PurchaseStatistic
from accounts.serializers import UserSerializer
from catalog.serializers import ProductSerializer


class CouponSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Coupon
        fields = "__all__"

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingCampaign
        fields = "__all__"

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"

class VisitSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    producto = ProductSerializer(read_only=True)
    class Meta: 
        model = VisitStatistic
        fields = "__all__"

class PurchaseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    producto = ProductSerializer(read_only=True)   
    class Meta:
        model = PurchaseStatistic
        fields = "__all__"