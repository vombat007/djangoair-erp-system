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
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = CustomerCabinet
        fields = ['user', 'discount', 'future_flight', 'previous_flight', 'first_name', 'last_name']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        first_name = user_data.get('first_name')
        last_name = user_data.get('last_name')

        instance = super().update(instance, validated_data)

        user = instance.user
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        user.save()

        return instance


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class OptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Options
        fields = '__all__'


class TicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = '__all__'


class SeatTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatType
        fields = '__all__'
