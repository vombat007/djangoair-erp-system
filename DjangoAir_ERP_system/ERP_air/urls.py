from django.urls import path
from .views import *

urlpatterns = [
    path('api/register/', UserRegistrationAPIView.as_view(), name='user-registration'),
    path('api/login/', UserLoginAPIView.as_view(), name='user-login'),
    path('api/logout/', UserLogoutAPIView.as_view(), name='user-logout'),
    path('api/user_cabinet/', UserCabinetViewAPIView.as_view(), name='customer_cabinet'),
    path('api/flight/search/', FlightSearchAPIView.as_view(), name='flight-search'),
    path('api/flight/details/', FlightDetailsAPIView.as_view(), name='options'),
    path('api/flight/booking/', BookingFlightAPIView.as_view(), name='flight-booking'),
    path('api/flight/check_in/', CheckInAPIView.as_view(), name='check_in'),
    path('api/stuff_cabinet/', StuffCabinetAPIView.as_view(), name='stuff_cabinet'),
    path('api/flights/', FlightsListAPIView.as_view(), name='flights'),
    path('api/customers/', CustomersListAPIView.as_view(), name='customers'),
    path('api/airplanes/', AirplanesListAPIView.as_view(), name='airplanes'),
]
