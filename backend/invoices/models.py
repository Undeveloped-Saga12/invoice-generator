from django.db import models

class Invoice(models.Model):
    business_name = models.CharField(max_length=255)
    business_email = models.EmailField()
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateField()
    due_date = models.DateField()

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number