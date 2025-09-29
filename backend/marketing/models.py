from django.db import models

from catalog.models import Product
from accounts.models import User
# Create your models here.
# MARKETING

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.code
    


class MarketingCampaign(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class Report(models.Model):
    report_type = models.CharField(max_length=50)
    generated_at = models.DateField(auto_now_add=True)
    generated_by = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.report_type} - {self.generated_at}"


# Statistics
class VisitStatistic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="visit_statistics")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="visit_statistics")
    date = models.DateField(auto_now_add=True)
    device = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.user} visited {self.product}"


class PurchaseStatistic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchase_statistics")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="purchase_statistics")
    quantity = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} purchased {self.quantity}x {self.product}"
