from rest_framework import serializers
from .models import Payment, Invoice


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'subscription', 'payment_method', 'amount',
            'transaction_id', 'status', 'payment_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['transaction_id', 'payment_date', 'created_at', 'updated_at']


class InvoiceSerializer(serializers.ModelSerializer):
    subscription_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'subscription', 'subscription_details', 'payment',
            'invoice_number', 'rental_amount', 'security_deposit',
            'gst_amount', 'total_amount', 'invoice_date',
            'is_paid', 'paid_date', 'created_at'
        ]
        read_only_fields = ['invoice_number', 'gst_amount', 'total_amount', 'created_at']
    
    def get_subscription_details(self, obj):
        from subscriptions.serializers import SubscriptionSerializer
        return SubscriptionSerializer(obj.subscription).data


class ProcessPaymentSerializer(serializers.Serializer):
    subscription_id = serializers.UUIDField()
    payment_method = serializers.ChoiceField(choices=['upi', 'card', 'netbanking', 'wallet'])
