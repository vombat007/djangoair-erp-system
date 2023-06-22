from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from ERP_air.models import User


class CustomerCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'password1', 'password2')


class CustomerLoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ('email', 'password')
