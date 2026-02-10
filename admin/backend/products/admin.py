from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active', 'display_order', 'product_count']
    list_filter = ['is_active', 'parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']
    
    def product_count(self, obj):
        """Show number of products in category"""
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'category', 
        'vendor', 
        'daily_price', 
        'quantity', 
        'available_quantity',
        'is_active', 
        'created_at'
    ]
    list_filter = ['is_active', 'is_featured', 'category', 'created_at']
    search_fields = ['name', 'description', 'vendor__email']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['view_count', 'rental_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'description')
        }),
        ('Pricing', {
            'fields': ('daily_price', 'weekly_price', 'monthly_price', 'security_deposit')
        }),
        ('Inventory', {
            'fields': ('quantity', 'available_quantity')
        }),
        ('Vendor & Location', {
            'fields': ('vendor', 'city', 'state')
        }),
        ('Media', {
            'fields': ('main_image',)
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Statistics', {
            'fields': ('view_count', 'rental_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
