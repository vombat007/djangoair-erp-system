from django.contrib.auth import authenticate, login, logout
from django.db.models import Sum, F
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomerCreationForm, CustomerLoginForm
from .serializers import *
from datetime import datetime
from .utils import *


class UserRegistrationAPIView(APIView):
    def post(self, request):
        form = CustomerCreationForm(request.data)
        if form.is_valid():
            user = form.save()

            customer_cabinet = CustomerCabinet.objects.create(
                user=user,
                discount=0,
            )
            user.customer_cabinet = customer_cabinet
            user.save()

            return Response({'message': 'Customer registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPIView(APIView):
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


class UserLogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class UserCabinetViewAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_serializer = UserSerializer(user)
        customer_cabinet = CustomerCabinet.objects.get(user=user)
        serializer = CustomerCabinetSerializer(customer_cabinet)

        future_tickets = Ticket.objects.filter(user=user, flight__departure_date__gte=datetime.now())
        past_tickets = Ticket.objects.filter(user=user, flight__departure_date__lt=datetime.now())

        # Update the TicketSerializer with the additional fields
        future_tickets_serializer = TicketSerializer(future_tickets, many=True)
        past_tickets_serializer = TicketSerializer(past_tickets, many=True)

        data = {
            'user': user_serializer.data,
            'customer_cabinet': serializer.data,
            'future_flight': future_tickets_serializer.data,
            'past_flight': past_tickets_serializer.data,
        }
        return Response(data)

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
            seat_types = flight.airplane.seat_set.filter(is_booked=False).values(
                'seat_type__seat_type',
                'seat_type__quantity',
                'seat_type__price'
            ).annotate(available_quantity=Sum('seat_type__quantity')).distinct()

            total_quantity = sum(seat_type['seat_type__quantity'] for seat_type in seat_types)

            if total_quantity is not None and total_quantity >= seats_count:
                filtered_seat_types = []
                for seat_type in seat_types:
                    filtered_seat_types.append({
                        'seat_type': seat_type['seat_type__seat_type'],
                        'quantity': seat_type['seat_type__quantity'],
                        'price': seat_type['seat_type__price'],
                    })
                    # Break the loop after adding the first seat type
                    break

                filtered_flights.append({
                    'flight_id': flight.id,
                    'departure_date': flight.departure_date.strftime('%Y-%m-%d %H:%M'),
                    'destination': flight.destination,
                    'free_seat_count': total_quantity,
                })

        return Response(filtered_flights)


class FlightDetailsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        flight_id = request.query_params.get('flight_id')

        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight does not exist."}, status=status.HTTP_404_NOT_FOUND)

        seat_types = SeatType.objects.filter(seat__airplane=flight.airplane).distinct()
        options = Options.objects.all()
        seats = Seat.objects.filter(airplane=flight.airplane)

        seat_type_serializer = SeatTypeSerializer(seat_types, many=True)
        option_serializer = OptionsSerializer(options, many=True)
        seat_serializer = SeatSerializer(seats, many=True)

        data = {
            'seats': seat_serializer.data,
            'seat_types': seat_type_serializer.data,
            'options': option_serializer.data,
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
        user = request.user
        flight_id = request.data.get('flight_id')
        seat_id = request.data.get('seat_id')
        option_ids = request.data.get('option_ids', [])

        price = request.data.get('price')
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
            "price": price,
            "options": option_ids,
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

            send_ticket_email(user, ticket)

            if option_ids:
                ticket.options.add(*option_ids)
                serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckInAPIView(APIView):
    def post(self, request):
        ticket_number = request.data.get('ticket_number', None)
        seat_number = request.data.get('seat_number', None)  # Get the provided seat number

        if not ticket_number:
            return Response({'error': 'Ticket number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ticket = Ticket.objects.get(ticket_number=ticket_number)
        except Ticket.DoesNotExist:
            return Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        if ticket.seat.seat_number is not None:
            return Response({'error': 'Ticket has already been checked-in.'}, status=status.HTTP_400_BAD_REQUEST)

        if seat_number is None or seat_number == '':  # If seat_number is not provided, generate one
            seat_number = generate_seat_number(ticket.flight, ticket.seat.seat_type)
            ticket.seat.seat_number = seat_number
            ticket.seat.is_booked = True
            ticket.seat.save()
            ticket.save()
        else:
            ticket.seat.seat_number = seat_number
            ticket.seat.is_booked = True
            ticket.seat.save()
            ticket.save()

        return Response({'seat_number': seat_number}, status=status.HTTP_200_OK)


class CustomersListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customers = User.objects.filter(role=User.CUSTOMER)
        customers_serializer = UserSerializer(customers, many=True)
        return Response(customers_serializer.data)


class StuffListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        gate_manager = User.objects.filter(role=User.GATE_MANAGER)
        check_in_manager = User.objects.filter(role=User.CHECKIN_MANAGER)
        supervisor = User.objects.filter(role=User.SUPERVISOR)

        gate_manager_serializer = UserSerializer(gate_manager, many=True)
        check_in_manager_serializer = UserSerializer(check_in_manager, many=True)
        supervisor_serializer = UserSerializer(supervisor, many=True)

        stuff_data = {
            "gate_manager": gate_manager_serializer.data,
            "check_in_manager": check_in_manager_serializer.data,
            "supervisor": supervisor_serializer.data,
        }

        return Response(stuff_data, status=status.HTTP_200_OK)


class AirplanesListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        airplane = Airplane.objects.all()
        airplane_serializer = AirplaneSerializer(airplane, many=True)
        return Response(airplane_serializer.data)

    def post(self, request):
        airplane_serializer = AirplaneSerializer(data=request.data)
        if airplane_serializer.is_valid():
            airplane_serializer.save()
            return Response(airplane_serializer.data, status=status.HTTP_201_CREATED)
        return Response(airplane_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketSearchAPIView(APIView):
    def get(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
            tickets = Ticket.objects.filter(flight=flight)

            ticket_data = []
            for ticket in tickets:
                ticket_info = {
                    'ticket_number': ticket.ticket_number,
                    'price': ticket.price,
                    'gender': ticket.gender,
                    'user': {
                        'email': ticket.user.email,
                        'first_name': ticket.user.first_name,
                        'last_name': ticket.user.last_name,
                    },
                    'flight': {
                        'departure_date': ticket.flight.departure_date,
                        'destination': ticket.flight.destination,
                    },
                    'seat': {
                        'seat_type': ticket.seat.seat_type.seat_type,
                        'seat_number': ticket.seat.seat_number,
                    },
                    'options': [{
                        'name': option.name,
                        'price': option.price,
                    } for option in ticket.options.all()],
                }
                ticket_data.append(ticket_info)

            response_data = {
                'flight': {
                    'departure_date': flight.departure_date,
                    'destination': flight.destination,
                },
                'tickets': ticket_data,
            }

            return Response(response_data)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)


class SeatAvailabilityAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
            seats = Seat.objects.filter(airplane=flight.airplane)
            seat_types = SeatType.objects.filter(seat__airplane=flight.airplane).distinct()

            seat_data = {}
            for seat_type in seat_types:
                booked_seats = seats.filter(seat_type=seat_type, is_booked=True).count()
                free_seats = seats.filter(seat_type=seat_type, is_booked=False).count()

                # Calculate the numbers for check-in
                total_seats = booked_seats + free_seats
                numbers_for_checkin = [str(i) for i in range(1, total_seats + 1) if
                                       not seats.filter(seat_type=seat_type, is_booked=True, seat_number=i).exists()]

                seat_info = {
                    'number_booked_seat': booked_seats,
                    'number_free_seat': free_seats,
                    'number_for_checkin': ', '.join(numbers_for_checkin),
                }
                seat_data[seat_type.seat_type] = seat_info

            response_data = {
                'seats': seat_data,
            }

            return Response(response_data)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)


class OptionsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        options = Options.objects.all()
        options_serializer = OptionsSerializer(options, many=True)
        return Response(options_serializer.data)

    def post(self, request):
        options_serializer = OptionsSerializer(data=request.data)

        if options_serializer.is_valid():
            options_serializer.save()
            return Response(options_serializer.data, status=status.HTTP_201_CREATED)

        return Response(options_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
