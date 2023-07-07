from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models, IntegrityError
from django.db.models import Count


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None, is_staff=False, is_superuser=False):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')

        if User.objects.filter(email=self.normalize_email(email).lower()).exists():
            raise ValueError('This email has already been registered.')

        user = self.model(
            email=self.normalize_email(email).lower(),
            is_staff=is_staff,
            is_superuser=is_superuser
        )

        user.set_password(password)
        try:
            user.save(using=self._db)
        except IntegrityError:
            raise ValueError('This email has already been registered.')

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    objects = MyUserManager()

    CUSTOMER = 'customer'
    GATE_MANAGER = 'gate_manager'
    CHECKIN_MANAGER = 'checkin_manager'
    SUPERVISOR = 'supervisor'

    ROLE_CHOICES = (
        (CUSTOMER, 'Customer'),
        (GATE_MANAGER, 'Gate Manager'),
        (CHECKIN_MANAGER, 'Check-in Manager'),
        (SUPERVISOR, 'Supervisor'),
    )

    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
        error_messages={
            'unique': "This email has already been registered.",
        }
    )
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=ROLE_CHOICES, default=CUSTOMER)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    is_email_validated = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        app_label = 'ERP_air'


class CustomerCabinet(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    discount = models.IntegerField(default=0)
    future_flight = models.DateTimeField(null=True, blank=True)
    previous_flight = models.DateTimeField(null=True, blank=True)


class Flight(models.Model):
    airplane = models.OneToOneField('Airplane', on_delete=models.CASCADE)
    departure_date = models.DateTimeField()
    destination = models.CharField(max_length=255)

    def update_available_seats(self):
        booked_seats = Ticket.objects.filter(flight=self).count()
        available_seats = self.airplane.seat_set.values('seat_type').annotate(total=Count('id'))
        for seat_type in available_seats:
            seat_type_obj = SeatType.objects.get(id=seat_type['seat_type'])
            quantity = seat_type_obj.quantity
            booked_quantity = seat_type['total']
            seat_type_obj.quantity = max(0, quantity - booked_quantity)
            seat_type_obj.save()


class Airplane(models.Model):
    name = models.CharField(max_length=255)


class SeatType(models.Model):
    FIRST_CLASS = 'first_class'
    BUSINESS_CLASS = 'business_class'
    ECONOMY_CLASS = 'economy_class'

    SEAT_TYPE = (
        (FIRST_CLASS, 'First_class'),
        (BUSINESS_CLASS, 'Business_class'),
        (ECONOMY_CLASS, 'Economy_class'),
    )

    seat_type = models.CharField(max_length=255, choices=SEAT_TYPE, default=ECONOMY_CLASS)
    quantity = models.IntegerField(default=0)


class Seat(models.Model):
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE)
    seat_type = models.ForeignKey(SeatType, on_delete=models.CASCADE)


class Option(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField()


class Ticket(models.Model):
    MALE = 'male'
    FEMALE = 'female'
    GENDER = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    )

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=30, choices=GENDER)
    passport_id = models.CharField(max_length=25)
    price = models.IntegerField(null=True, blank=True)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    seat = models.OneToOneField(Seat, on_delete=models.CASCADE)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
