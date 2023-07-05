from django.contrib.auth import authenticate, login, logout
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomerCreationForm, CustomerLoginForm
from .models import *
from .serializers import CustomerCabinetSerializer, FlightSerializer
from datetime import datetime


class CustomerRegistrationAPIView(APIView):
    def post(self, request):
        form = CustomerCreationForm(request.data)
        if form.is_valid():
            user = form.save()

            # Create a customer cabinet for the user
            customer_cabinet = CustomerCabinet.objects.create(
                user=user,
                discount=0,
                future_flight=None,
                previous_flight=None
            )
            user.customer_cabinet = customer_cabinet
            user.save()

            return Response({'message': 'Customer registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerLoginAPIView(APIView):
    def post(self, request):
        form = CustomerLoginForm(data=request.data)
        if form.is_valid():
            email = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return Response({'message': 'Login successful'}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'message': 'Invalid form data'}, status=status.HTTP_400_BAD_REQUEST)


class CustomerLogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class CustomerCabinetViewAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Add permission class

    def get(self, request):
        user = request.user
        customer_cabinet = CustomerCabinet.objects.get(user=user)
        serializer = CustomerCabinetSerializer(customer_cabinet)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        customer_cabinet = CustomerCabinet.objects.get(user=user)
        serializer = CustomerCabinetSerializer(customer_cabinet, data=request.data, partial=True)

        if serializer.is_valid():
            # Update the user's first_name and last_name fields if provided
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name']
            user.save()

            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class FlightsListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        flights = Flight.objects.all()
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlightSearchAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        destination = request.query_params.get('destination')
        departure_date = request.query_params.get('departure_date')

        # Convert departure_date from YY/MM/DD to datetime object
        try:
            departure_date = datetime.strptime(departure_date, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format. Please use YY/MM/DD format."},
                            status=status.HTTP_400_BAD_REQUEST)

        if destination == "":
            return Response({"error": "Destination must be Not Blank"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Query flights based on the destination and departure date
        flights = Flight.objects.filter(destination__iexact=destination, departure_date__date=departure_date)

        # Serialize the query result and format the departure_date
        serializer = FlightSerializer(flights, many=True, context={'request': request})
        data = [{
            'departure_date':
                f"{datetime.strptime(flight['departure_date'], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d %H:%M')}",
            'destination':
                flight['destination']} for flight in serializer.data]

        if not data:
            return Response([{
                'destination': 'Today the flight is not in this direction.',
                'departure_date': 'And for this date'
            }])
        else:
            return Response(data)
