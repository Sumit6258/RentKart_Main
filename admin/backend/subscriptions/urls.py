from django.urls import path
from . import views

urlpatterns = [
    path('', views.SubscriptionListView.as_view(), name='subscription-list'),
    path('create/', views.CreateSubscriptionView.as_view(), name='subscription-create'),
    path('<uuid:pk>/', views.SubscriptionDetailView.as_view(), name='subscription-detail'),
]
