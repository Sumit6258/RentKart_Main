from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer


class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'display_order', 'created_at']
    ordering = ['display_order', 'name']


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'


class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'is_featured']
    search_fields = ['name', 'description', 'city']
    ordering_fields = ['daily_price', 'created_at', 'view_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductListSerializer
        return ProductDetailSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ProductsByCategoryView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(
            category__slug=category_slug,
            is_active=True
        )


# Vendor Dashboard Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_dashboard_stats(request):
    """Get vendor dashboard statistics"""
    if request.user.role != 'vendor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from payments.models import Payment
    
    # Get vendor's products
    products = Product.objects.filter(vendor=request.user)
    
    # Get subscriptions for vendor's products
    subscriptions = Subscription.objects.filter(product__in=products)
    
    # Calculate stats
    active_rentals = subscriptions.filter(status='active').count()
    total_products = products.count()
    
    # Calculate total earnings (from successful payments)
    payments = Payment.objects.filter(
        subscription__in=subscriptions,
        status='success'
    )
    total_earnings = sum(float(p.amount) for p in payments)
    
    return Response({
        'active_rentals': active_rentals,
        'total_products': total_products,
        'total_earnings': total_earnings,
        'pending_rentals': subscriptions.filter(status='pending').count(),
        'completed_rentals': subscriptions.filter(status='completed').count()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_products(request):
    """Get vendor's products"""
    if request.user.role != 'vendor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    products = Product.objects.filter(vendor=request.user)
    serializer = ProductDetailSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_rentals(request):
    """Get rentals for vendor's products"""
    if request.user.role != 'vendor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from subscriptions.serializers import SubscriptionSerializer
    
    products = Product.objects.filter(vendor=request.user)
    subscriptions = Subscription.objects.filter(product__in=products)
    
    serializer = SubscriptionSerializer(subscriptions, many=True)
    return Response(serializer.data)
