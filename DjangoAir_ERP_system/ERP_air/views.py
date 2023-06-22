from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomerCreationForm, CustomerLoginForm


class CustomerRegistrationAPIView(APIView):
    def post(self, request):
        form = CustomerCreationForm(request.data)
        if form.is_valid():
            user = form.save()
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
            return Response({'message': 'Invalid form data'},  status=status.HTTP_400_BAD_REQUEST)


class CustomerLogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})

