from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.http import HttpResponse
from .models import Payment, Invoice
from .serializers import PaymentSerializer, InvoiceSerializer, ProcessPaymentSerializer
from subscriptions.models import Subscription
import random

# PDF Generation
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from io import BytesIO
from decimal import Decimal


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request):
    """Simulated payment processing"""
    serializer = ProcessPaymentSerializer(data=request.data)
    
    if serializer.is_valid():
        subscription_id = serializer.validated_data['subscription_id']
        payment_method = serializer.validated_data['payment_method']
        
        try:
            subscription = Subscription.objects.get(id=subscription_id)
            
            payment = Payment.objects.create(
                subscription=subscription,
                payment_method=payment_method,
                amount=subscription.total_amount,
                status='pending'
            )
            
            # Simulate payment processing (80% success rate)
            success = random.random() < 0.8
            
            if success:
                payment.status = 'success'
                payment.payment_date = timezone.now()
                payment.save()
                
                subscription.status = 'active'
                subscription.save()
                
                # Create invoice
                invoice = Invoice.objects.create(
                    subscription=subscription,
                    payment=payment,
                    rental_amount=subscription.total_amount - (subscription.security_deposit or 0),
                    security_deposit=subscription.security_deposit or 0,
                    is_paid=True,
                    paid_date=timezone.now()
                )
                
                return Response({
                    'success': True,
                    'message': 'Payment successful!',
                    'payment': PaymentSerializer(payment).data,
                    'invoice': InvoiceSerializer(invoice).data
                }, status=status.HTTP_200_OK)
            else:
                payment.status = 'failed'
                payment.save()
                
                return Response({
                    'success': False,
                    'message': 'Payment failed. Please try again.',
                    'payment': PaymentSerializer(payment).data
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except Subscription.DoesNotExist:
            return Response({
                'error': 'Subscription not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """Get user's payment history"""
    from customers.models import Customer
    
    try:
        customer = Customer.objects.get(user=request.user)
        subscriptions = Subscription.objects.filter(customer=customer)
        payments = Payment.objects.filter(subscription__in=subscriptions)
        
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
    except Customer.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def invoice_list(request):
    """Get user's invoices"""
    from customers.models import Customer
    
    try:
        customer = Customer.objects.get(user=request.user)
        subscriptions = Subscription.objects.filter(customer=customer)
        invoices = Invoice.objects.filter(subscription__in=subscriptions)
        
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
    except Customer.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def invoice_detail(request, invoice_id):
    """Get invoice details"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)
    except Invoice.DoesNotExist:
        return Response({
            'error': 'Invoice not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice_pdf(request, invoice_id):
    """Generate and download invoice PDF"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        subscription = invoice.subscription
        product = subscription.product
        customer = subscription.customer
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
        story = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#1E40AF'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        story.append(Paragraph('🏠 RENTKART', title_style))
        
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#4B5563'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        story.append(Paragraph('TAX INVOICE', subtitle_style))
        story.append(Spacer(1, 0.3 * inch))
        
        # Invoice Info Header
        info_data = [
            ['Invoice Number:', invoice.invoice_number, 'Invoice Date:', invoice.invoice_date.strftime('%B %d, %Y')],
            ['Payment Status:', 'PAID' if invoice.is_paid else 'UNPAID', 'Transaction ID:', invoice.payment.transaction_id if invoice.payment else 'N/A'],
        ]
        
        info_table = Table(info_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#EFF6FF')),
            ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#EFF6FF')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 0.4 * inch))
        
        # Customer & Product Details
        header_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1E40AF'),
            spaceAfter=10,
            fontName='Helvetica-Bold'
        )
        story.append(Paragraph('Customer Details', header_style))
        
        customer_data = [
            ['Customer Name:', customer.user.get_full_name() or customer.user.email],
            ['Email:', customer.user.email],
            ['Phone:', customer.user.phone or 'N/A'],
        ]
        
        customer_table = Table(customer_data, colWidths=[2*inch, 4.5*inch])
        customer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F3F4F6')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
        ]))
        story.append(customer_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Rental Details
        story.append(Paragraph('Rental Details', header_style))
        
        rental_data = [
            ['Product', 'Duration', 'Start Date', 'End Date', 'Amount'],
            [
                Paragraph(product.name, styles['Normal']),
                subscription.duration_type.capitalize(),
                subscription.start_date.strftime('%d/%m/%Y'),
                subscription.end_date.strftime('%d/%m/%Y'),
                f'₹{float(invoice.rental_amount):,.2f}'
            ]
        ]
        
        rental_table = Table(rental_data, colWidths=[2.5*inch, 1*inch, 1*inch, 1*inch, 1*inch])
        rental_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E40AF')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('TOPPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F9FAFB')),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(rental_table)
        story.append(Spacer(1, 0.4 * inch))
        
        # Amount Breakdown
        story.append(Paragraph('Payment Summary', header_style))
        
        amount_data = [
            ['Description', 'Amount'],
            ['Rental Amount', f'₹{float(invoice.rental_amount):,.2f}'],
            ['GST (18%)', f'₹{float(invoice.gst_amount):,.2f}'],
            ['Security Deposit (Refundable)', f'₹{float(invoice.security_deposit):,.2f}'],
            ['Total Amount Paid', f'₹{float(invoice.total_amount):,.2f}']
        ]
        
        amount_table = Table(amount_data, colWidths=[5*inch, 1.5*inch])
        amount_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E40AF')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 1), (-1, -2), colors.HexColor('#F9FAFB')),
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.HexColor('#1E40AF')),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#DBEAFE')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        story.append(amount_table)
        story.append(Spacer(1, 0.4 * inch))
        
        # Terms & Footer
        terms_style = ParagraphStyle(
            'Terms',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#6B7280'),
            spaceAfter=6
        )
        
        story.append(Paragraph('<b>Terms & Conditions:</b>', terms_style))
        story.append(Paragraph('1. Security deposit is fully refundable upon return of product in original condition.', terms_style))
        story.append(Paragraph('2. Late returns may incur additional charges.', terms_style))
        story.append(Paragraph('3. Customer is responsible for the product during rental period.', terms_style))
        story.append(Spacer(1, 0.3 * inch))
        
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#4B5563'),
            alignment=TA_CENTER
        )
        story.append(Paragraph('Thank you for choosing Rentkart!', footer_style))
        story.append(Paragraph('For support, contact: support@rentkart.com | +91 98765 43210', footer_style))
        
        # Build PDF
        doc.build(story)
        
        # Return PDF
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Rentkart_Invoice_{invoice.invoice_number}.pdf"'
        return response
        
    except Invoice.DoesNotExist:
        return HttpResponse('Invoice not found', status=404)
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return HttpResponse(f'Error generating PDF: {str(e)}', status=500)
