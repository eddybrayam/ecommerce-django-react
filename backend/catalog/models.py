from django.db import models

# Product Categories
class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


# Products
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# Stock History
class StockHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="stock_history")
    quantity = models.IntegerField()
    movement_type = models.CharField(max_length=50) #si el producto entro o salio
    date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.movement_type} {self.quantity} - {self.product}"
