from django.contrib.auth import authenticate, login, logout
from django.db.models import Sum, F
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomerCreationForm, CustomerLoginForm
from .serializers import *
from datetime import datetime
from .utils import generate_random_code


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
        seats_count = request.query_params.get('seats_count')

        try:
            departure_date = datetime.strptime(departure_date, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format. Please use YY/MM/DD format."},
                            status=status.HTTP_400_BAD_REQUEST)

        if destination == "":
            return Response({"error": "Destination must not be blank."},
                            status=status.HTTP_400_BAD_REQUEST)

        if seats_count is None or not seats_count.isdigit():
            return Response({"error": "Invalid seats count. Please provide a valid number."},
                            status=status.HTTP_400_BAD_REQUEST)

        seats_count = int(seats_count)

        # Query flights based on the destination and departure date
        flights = Flight.objects.filter(
            destination__iexact=destination,
            departure_date__date=departure_date
        )

        filtered_flights = []
        for flight in flights:
            total_quantity = flight.airplane.seat_set.aggregate(
                total_quantity=Sum('seat_type__quantity'))['total_quantity']
            if total_quantity is not None and total_quantity >= seats_count:
                filtered_flights.append({
                    'flight_id': flight.id,
                    'departure_date': flight.departure_date.strftime('%Y-%m-%d %H:%M'),
                    'destination': flight.destination
                })

        return Response(filtered_flights)


class OptionsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        flight_id = request.query_params.get('flight_id')

        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        seat_types = SeatType.objects.filter(seat__airplane=flight.airplane).distinct()
        options = Options.objects.all()

        seat_type_serializer = SeatTypeSerializer(seat_types, many=True)
        option_serializer = OptionsSerializer(options, many=True)

        data = {
            'seat_types': seat_type_serializer.data,
            'options': option_serializer.data
        }

        return Response(data)


class BookingFlightAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        tickets = Ticket.objects.filter(user=user)
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        flight_id = request.data.get('flight_id')
        seat_id = request.data.get('seat_id')
        option_ids = request.data.get('option_ids', [])

        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        gender = request.data.get('gender')
        passport_number = request.data.get('passport_number')

        # Check if flight exists
        try:
            flight = Flight.objects.get(pk=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        # Check if seat exists and is available
        try:
            seat = Seat.objects.select_for_update().get(pk=seat_id, airplane=flight.airplane)
            if seat.is_booked:
                return Response({"error": "Seat is already booked."},
                                status=status.HTTP_400_BAD_REQUEST)
        except Seat.DoesNotExist:
            return Response({"error": "Seat does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        # Create the ticket
        ticket_data = {
            "ticket_number": generate_random_code(),
            "user": request.user.id,
            "flight": flight_id,
            "seat": seat_id,
            "gender": gender,
            "first_name": first_name,
            "last_name": last_name,
            "passport_number": passport_number,
        }
        serializer = TicketSerializer(data=ticket_data)
        if serializer.is_valid():
            if seat.seat_type.quantity <= 0:
                return Response({"error": "No seat left."},
                                status=status.HTTP_404_NOT_FOUND)
            ticket = serializer.save()
            seat.is_booked = True
            seat.seat_type.quantity = F('quantity') - 1
            seat.seat_type.save()
            seat.save()
            if option_ids:
                ticket.options.add(*option_ids)
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
