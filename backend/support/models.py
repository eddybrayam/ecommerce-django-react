from django.db import models
from orders.models import Order
from catalog.models import Product
from accounts.models import User

# Create your models here.
class Return(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="returns")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="returns")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="returns")
    date = models.DateField(auto_now_add=True)
    reason = models.TextField()
    status = models.CharField(max_length=50)
    
    def __str__(self):
        return f"Return {self.product} - {self.user}"


class Complaint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="complaints")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="complaints")
    description = models.TextField()
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=50)
    
    def __str__(self):
        return f"Complaint {self.id} - {self.user}"
