from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Subscription
from .serializers import SubscriptionSerializer, CreateSubscriptionSerializer
from customers.models import Customer


class SubscriptionListView(generics.ListAPIView):
    """List user's subscriptions"""
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return Subscription.objects.filter(customer=customer)


class CreateSubscriptionView(generics.CreateAPIView):
    """Create a new subscription"""
    serializer_class = CreateSubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        # Get or create customer
        customer, created = Customer.objects.get_or_create(user=request.user)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create subscription with customer
        subscription = serializer.save(customer=customer)
        
        response_serializer = SubscriptionSerializer(subscription)
        return Response({
            'subscription': response_serializer.data,
            'message': 'Rental created successfully!'
        }, status=status.HTTP_201_CREATED)


class SubscriptionDetailView(generics.RetrieveAPIView):
    """Get subscription details"""
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        customer = Customer.objects.get(user=self.request.user)
        return Subscription.objects.filter(customer=customer)
