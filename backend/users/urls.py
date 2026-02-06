from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Public auth
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/picture/', views.upload_profile_picture, name='upload-profile-picture'),
    path('profile/picture/remove/', views.remove_profile_picture, name='remove-profile-picture'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Admin auth
    path('admin/login/', views.admin_login_view, name='admin-login'),
    
    # Admin APIs
    path('admin/stats/', views.admin_stats, name='admin-stats'),
    path('admin/users/', views.admin_users_list, name='admin-users-list'),
    path('admin/users/<uuid:user_id>/toggle/', views.admin_toggle_user, name='admin-toggle-user'),
    path('admin/products/', views.admin_all_products, name='admin-products'),
    path('admin/rentals/', views.admin_all_rentals, name='admin-rentals'),
    path('admin/payments/', views.admin_all_payments, name='admin-payments'),
]
