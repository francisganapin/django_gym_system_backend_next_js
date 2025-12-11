from django.db import models




class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to='products',blank=True,null=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    PAYMENT_CHOICES = [
        ('cash','Cash'),
        ('gcash','Gcash'),
        ('online','Online'),
    ]

    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10,decimal_places=2)
    payment_method = models.CharField(max_length=20,choices=PAYMENT_CHOICES)

    cash_amount = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    changes = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)


    def __str__(self):
        return f"Transaction #{self.id} - {self.date}"


class CartItem(models.Model):
    transaction = models.ForeignKey(Transaction,related_name='cart_item',on_delete=models.CASCADE)

    name = models.ForeignKey(Product,on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    qty = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.name} x {self.qty}"


