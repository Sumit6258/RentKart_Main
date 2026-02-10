
from django.db import models
from django.utils import timezone
from users.models import User
from products.models import Product
from subscriptions.models import Subscription
import uuid
from datetime import datetime
from decimal import Decimal


class Payment(models.Model):
    """Payment transaction model"""
    
    PAYMENT_METHOD_CHOICES = [
        ('upi', 'UPI'),
        ('card', 'Credit/Debit Card'),
        ('netbanking', 'Net Banking'),
        ('wallet', 'Digital Wallet'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    transaction_id = models.CharField(max_length=100, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    payment_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.transaction_id} - {self.status}"
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = f"TXN{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)


class Invoice(models.Model):
    """Invoice model"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, related_name='invoice')
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, related_name='invoices')
    
    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    
    # Amounts
    rental_amount = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Dates
    invoice_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    
    # Status
    is_paid = models.BooleanField(default=False)
    paid_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.invoice_number
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            year = datetime.now().year
            count = Invoice.objects.filter(
                invoice_number__startswith=f'INV-{year}'
            ).count() + 1
            self.invoice_number = f'INV-{year}-{count:05d}'
        
        # Calculate GST (18%) - Use Decimal for calculation
        if not self.gst_amount or self.gst_amount == 0:
            gst_rate = Decimal('0.18')
            self.gst_amount = (self.rental_amount * gst_rate).quantize(Decimal('0.01'))
        
        # Calculate total
        self.total_amount = self.rental_amount + self.security_deposit + self.gst_amount
        
        super().save(*args, **kwargs)
