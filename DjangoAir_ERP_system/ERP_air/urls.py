from django.urls import path
from .views import UserRegistrationAPIView

urlpatterns = [
    path('api/register/', UserRegistrationAPIView.as_view(), name='user-registration'),
]
