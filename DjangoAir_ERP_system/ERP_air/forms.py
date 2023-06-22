from django.contrib.auth.forms import UserCreationForm
from ERP_air.models import User


class CustomerCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'password1', 'password2')
