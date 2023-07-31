from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Ticket)
admin.site.register(Airplane)
admin.site.register(Seat)
admin.site.register(SeatType)
admin.site.register(Options)
admin.site.register(Flight)
admin.site.register(CustomerCabinet)
