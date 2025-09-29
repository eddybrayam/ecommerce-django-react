from django.db import models
from accounts.models  import User 
from catalog.models import Product
# Create your models here.
# Favorites
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="favorites")
    added_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} -> {self.product}"
    

# Recommendations
class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recommendations")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="recommendations")
    source = models.CharField(max_length=50)  # where the recommendation comes from
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} recommends {self.product}"


# Reviews
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user} - {self.rating}⭐"
