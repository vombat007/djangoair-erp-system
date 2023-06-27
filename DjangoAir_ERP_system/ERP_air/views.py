from django.contrib.auth import authenticate, login, logout
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomerCreationForm, CustomerLoginForm
from .models import CustomerCabinet
from .serializers import CustomerCabinetSerializer


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
