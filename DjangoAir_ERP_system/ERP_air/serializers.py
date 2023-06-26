from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'role')
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'default': User.CUSTOMER}
        }

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class CustomerCabinetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCabinet
        fields = ('balance', 'discount', 'future_flight', 'previous_flight')
