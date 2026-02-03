from rest_framework import serializers
from .models import Customer, Address
from users.serializers import UserSerializer


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'customer', 'address_line1', 'address_line2',
            'city', 'state', 'pincode', 'is_default',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['customer', 'created_at', 'updated_at']


class CustomerSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = Customer
        fields = [
            'id', 'user', 'user_details',
            'address', 'city', 'addresses', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']


class UpdateCustomerProfileSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    city = serializers.CharField(required=False)
