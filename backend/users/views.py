from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    LoginSerializer, ProfilePictureUploadSerializer
)
from .models import User
from customers.models import Customer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """User registration with auto-create Customer profile"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        if user.role == 'customer':
            Customer.objects.get_or_create(user=user)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Registration successful!'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User login"""
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    'message': 'Login successful!'
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_view(request):
    """Admin login - accepts superuser or admin role"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        # Try to get user with admin role OR superuser status
        user = User.objects.get(email=email)
        
        # Check if user is superuser or has admin role
        if not (user.is_superuser or user.role == 'admin'):
            return Response({
                'error': 'Access denied. Admin privileges required.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verify password
        if user.check_password(password):
            # Update role to admin if superuser
            if user.is_superuser and user.role != 'admin':
                user.role = 'admin'
                user.save()
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'Admin login successful!'
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    return Response({'message': 'Logout successful'})


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get or update user profile"""
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    
    elif request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': serializer.data,
                'message': 'Profile updated successfully!'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_picture(request):
    """Upload profile picture"""
    serializer = ProfilePictureUploadSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        user.profile_picture = serializer.validated_data['profile_picture']
        user.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Profile picture uploaded successfully!'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ADMIN APIS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    """Admin dashboard statistics"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from payments.models import Payment
    from products.models import Product
    
    total_users = User.objects.count()
    total_customers = User.objects.filter(role='customer').count()
    total_vendors = User.objects.filter(role='vendor').count()
    total_products = Product.objects.count()
    active_rentals = Subscription.objects.filter(status='active').count()
    
    # Calculate monthly revenue
    from django.utils import timezone
    from datetime import timedelta
    thirty_days_ago = timezone.now() - timedelta(days=30)
    monthly_payments = Payment.objects.filter(
        status='success',
        payment_date__gte=thirty_days_ago
    )
    monthly_revenue = sum(float(p.amount) for p in monthly_payments)
    
    return Response({
        'total_users': total_users,
        'total_customers': total_customers,
        'total_vendors': total_vendors,
        'total_products': total_products,
        'active_rentals': active_rentals,
        'monthly_revenue': monthly_revenue
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    """List all users for admin"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    role_filter = request.GET.get('role', None)
    
    if role_filter:
        users = User.objects.filter(role=role_filter)
    else:
        users = User.objects.all()
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_user(request, user_id):
    """Block/unblock user"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        
        return Response({
            'message': f'User {"activated" if user.is_active else "deactivated"}',
            'user': UserSerializer(user).data
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_products(request):
    """List all products for admin"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from products.models import Product
    from products.serializers import ProductDetailSerializer
    
    products = Product.objects.all()
    serializer = ProductDetailSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_rentals(request):
    """List all rentals for admin"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from subscriptions.models import Subscription
    from subscriptions.serializers import SubscriptionSerializer
    
    subscriptions = Subscription.objects.all()
    serializer = SubscriptionSerializer(subscriptions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_payments(request):
    """List all payments for admin"""
    if not (request.user.is_superuser or request.user.role == 'admin'):
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    from payments.models import Payment
    from payments.serializers import PaymentSerializer
    
    payments = Payment.objects.all()
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_profile_picture(request):
    """Remove user's profile picture"""
    user = request.user
    if user.profile_picture:
        # Delete the file
        user.profile_picture.delete()
        user.profile_picture = None
        user.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Profile picture removed successfully!'
        })
    
    return Response({
        'error': 'No profile picture to remove'
    }, status=status.HTTP_400_BAD_REQUEST)
