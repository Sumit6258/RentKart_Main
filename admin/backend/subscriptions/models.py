from django.db import models
from django.utils import timezone
from users.models import User
from products.models import Product
from customers.models import Customer
import uuid
from datetime import timedelta


class Subscription(models.Model):
    """Rental subscription model"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    DURATION_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relations
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='subscriptions')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='subscriptions')
    
    # Rental Details
    duration_type = models.CharField(max_length=20, choices=DURATION_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Pricing
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.customer.user.email} - {self.product.name}"
    
    @property
    def days_remaining(self):
        """Calculate remaining days"""
        if self.status != 'active':
            return 0
        today = timezone.now().date()
        if today >= self.end_date:
            return 0
        return (self.end_date - today).days
    
    @property
    def is_active(self):
        """Check if subscription is currently active"""
        return self.status == 'active' and self.days_remaining > 0
    
    def calculate_end_date(self):
        """Calculate end date based on duration type"""
        if self.duration_type == 'daily':
            self.end_date = self.start_date + timedelta(days=1)
        elif self.duration_type == 'weekly':
            self.end_date = self.start_date + timedelta(days=7)
        elif self.duration_type == 'monthly':
            self.end_date = self.start_date + timedelta(days=30)
    
    def calculate_total_amount(self):
        """Calculate total amount based on duration"""
        if self.duration_type == 'daily':
            self.total_amount = self.product.daily_price
        elif self.duration_type == 'weekly':
            self.total_amount = self.product.weekly_price or (self.product.daily_price * 7 * 0.9)
        elif self.duration_type == 'monthly':
            self.total_amount = self.product.monthly_price or (self.product.daily_price * 30 * 0.8)
    
    def save(self, *args, **kwargs):
        if not self.end_date:
            self.calculate_end_date()
        if not self.total_amount:
            self.calculate_total_amount()
        super().save(*args, **kwargs)
