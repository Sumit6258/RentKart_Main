from rest_framework import serializers
from .models import Subscription
from products.serializers import ProductListSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'customer', 'product', 'product_details',
            'duration_type', 'start_date', 'end_date',
            'total_amount', 'security_deposit', 'status',
            'days_remaining', 'is_active', 'created_at'
        ]
        read_only_fields = ['customer', 'end_date', 'total_amount']


class CreateSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['product', 'duration_type', 'start_date']
    
    def validate_start_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Start date cannot be in the past")
        return value
