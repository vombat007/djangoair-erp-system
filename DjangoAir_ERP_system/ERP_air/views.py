from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .forms import CustomerCreationForm


class CustomerRegistrationAPIView(APIView):
    def post(self, request):
        form = CustomerCreationForm(request.data)
        if form.is_valid():
            user = form.save()
            return Response({'message': 'Customer registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
