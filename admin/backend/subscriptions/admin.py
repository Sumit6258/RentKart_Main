from django.contrib import admin
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['customer', 'product', 'duration_type', 'start_date', 'end_date', 'status', 'days_remaining']
    list_filter = ['status', 'duration_type', 'created_at']
    search_fields = ['customer__user__email', 'product__name']
    readonly_fields = ['created_at', 'updated_at']
