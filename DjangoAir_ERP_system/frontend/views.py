from django.shortcuts import render


def index(request):
    return render(request, 'frontend/index.html')


def customer_cabinet(request):
    return render(request, 'frontend/customer_cabinet.html')
