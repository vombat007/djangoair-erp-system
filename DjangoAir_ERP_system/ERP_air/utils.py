import random
import string
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db import models
from ERP_air.models import Ticket


def generate_random_code():
    generated_codes = set()

    while True:
        prefix = ''.join(random.choice(string.ascii_uppercase) for _ in range(2))
        suffix = ''.join(random.choices(string.digits, k=8))
        code = f"{prefix}{suffix}"

        if code not in generated_codes:
            generated_codes.add(code)
            return code


def send_ticket_email(user, ticket):
    subject = 'Ticket Data'
    html_message_ticket = render_to_string(
        'Ticket.html',
        {
            'user': user,
            'ticket': ticket,
            'departure_date': ticket.flight.departure_date,
            'destination': ticket.flight.destination
        })

    html_message_bill = render_to_string(
        'Bill.html',
        {'user': user, 'ticket': ticket})

    plain_message_ticket = strip_tags(html_message_ticket)
    plain_message_bill = strip_tags(html_message_bill)

    send_mail(subject, plain_message_ticket,
              'Ticket Data <vombat007@gmail.com>',
              [user.email], html_message=html_message_ticket)

    send_mail(subject, plain_message_bill,
              'Bill <vombat007@gmail.com>',
              [user.email], html_message=html_message_bill)

    print('Email Send')


def generate_seat_number(flight, seat_type):
    tickets = Ticket.objects.filter(
        flight=flight,
        seat__seat_type=seat_type).exclude(seat__seat_number=None)
    max_seat_number = tickets.aggregate(models.Max('seat__seat_number'))['seat__seat_number__max'] or 0
    return max_seat_number + 1
