from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.process_payment, name='process-payment'),
    path('history/', views.payment_history, name='payment-history'),
    path('invoices/', views.invoice_list, name='invoice-list'),
    path('invoices/<uuid:invoice_id>/', views.invoice_detail, name='invoice-detail'),
    path('invoices/<uuid:invoice_id>/download/', views.download_invoice_pdf, name='download-invoice-pdf'),
]