from django.urls import path
from .views import CustomerRegistrationAPIView

urlpatterns = [
    path('api/register/', CustomerRegistrationAPIView.as_view(), name='user-registration'),
]
