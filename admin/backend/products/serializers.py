from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'parent', 'is_active', 'display_order',
            'product_count', 'subcategories'
        ]
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
    
    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(
                obj.subcategories.filter(is_active=True),
                many=True,
                context=self.context
            ).data
        return []


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listing"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 
            'category', 'category_name', 'category_slug',
            'daily_price', 'weekly_price', 'monthly_price',
            'main_image', 'vendor_name', 'city', 
            'is_available', 'is_featured', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Complete serializer for product detail page"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_id = serializers.CharField(source='category.id', read_only=True)
    
    vendor_name = serializers.CharField(source='vendor.get_full_name', read_only=True)
    vendor_email = serializers.EmailField(source='vendor.email', read_only=True)
    vendor_id = serializers.CharField(source='vendor.id', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            # Basic Info
            'id', 'name', 'slug', 'description',
            
            # Category
            'category', 'category_id', 'category_name', 'category_slug',
            
            # Pricing
            'daily_price', 'weekly_price', 'monthly_price', 'security_deposit',
            
            # Vendor
            'vendor', 'vendor_id', 'vendor_name', 'vendor_email',
            
            # Inventory
            'quantity', 'available_quantity',
            
            # Images & Location
            'main_image', 'city', 'state',
            
            # Status
            'is_active', 'is_featured', 'is_available',
            
            # Stats
            'view_count', 'rental_count',
            
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ['vendor', 'view_count', 'rental_count', 'created_at', 'updated_at']
