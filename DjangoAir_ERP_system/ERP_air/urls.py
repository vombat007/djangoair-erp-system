from django.urls import path
from .views import *

urlpatterns = [
    path('api/register/', CustomerRegistrationAPIView.as_view(), name='user-registration'),
    path('api/login/', CustomerLoginAPIView.as_view(), name='user-login'),
    path('api/logout/', CustomerLogoutAPIView.as_view(), name='user-logout'),
    path('api/customer_cabinet/', CustomerCabinetViewAPIView.as_view(), name='customer_cabinet'),
    path('api/flights/', FlightsListAPIView.as_view(), name='flights'),
    path('api/flight/search/', FlightSearchAPIView.as_view(), name='flight-search'),
    path('api/flight/details/', FlightDetailsAPIView.as_view(), name='options'),
    path('api/flight/booking/', BookingFlightAPIView.as_view(), name='flight-booking'),
    path('api/flight/check_in/', CheckInAPIView.as_view(), name='check_in'),
]
