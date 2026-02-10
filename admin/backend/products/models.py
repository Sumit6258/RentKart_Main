from django.db import models
from users.models import User
from django.utils.text import slugify
import uuid
from decimal import Decimal, ROUND_HALF_UP

class Category(models.Model):
    """Product categories"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    
    # Hierarchy support (for subcategories)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='subcategories',
        null=True,
        blank=True
    )
    
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)




class Product(models.Model):
    """Product model - must belong to a category"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Product must have a category
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,  # Prevent category deletion if products exist
        related_name='products'
    )

    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField()

    # Pricing
    daily_price = models.DecimalField(max_digits=10, decimal_places=2)
    weekly_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Vendor
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')

    # Inventory
    quantity = models.IntegerField(default=1)
    available_quantity = models.IntegerField(default=1)

    # Images
    main_image = models.ImageField(upload_to='products/', null=True, blank=True)

    # Location
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)

    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # Stats
    view_count = models.IntegerField(default=0)
    rental_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Auto-generate slug
        if not self.slug:
            self.slug = slugify(self.name)

        # Auto-calculate pricing (Decimal-safe, industry standard)
        if self.daily_price:
            daily = self.daily_price

            # Weekly price → ~25% discount
            if not self.weekly_price:
                self.weekly_price = (
                    daily * Decimal('7') * Decimal('0.75')
                ).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

            # Monthly price → ~60% discount
            if not self.monthly_price:
                self.monthly_price = (
                    daily * Decimal('30') * Decimal('0.40')
                ).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        super().save(*args, **kwargs)

    @property
    def is_available(self):
        """Check if product is available for rent"""
        return self.is_active and self.available_quantity > 0