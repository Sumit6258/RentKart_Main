from django.contrib import admin
from .models import Payment, Invoice


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'subscription', 'payment_method', 'amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['transaction_id', 'subscription__id']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'subscription', 'total_amount', 'is_paid', 'invoice_date']
    list_filter = ['is_paid', 'invoice_date']
    search_fields = ['invoice_number', 'subscription__id']
    readonly_fields = ['invoice_number', 'gst_amount', 'total_amount', 'created_at']
