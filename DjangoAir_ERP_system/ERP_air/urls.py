from django.urls import path
from .views import *

urlpatterns = [
    path('api/register/', CustomerRegistrationAPIView.as_view(), name='user-registration'),
    path('api/login/', CustomerLoginAPIView.as_view(), name='user-login'),
    path('api/logout/', CustomerLogoutAPIView.as_view(), name='user-logout'),
]
