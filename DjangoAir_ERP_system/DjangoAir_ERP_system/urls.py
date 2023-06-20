from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('ERP_air.urls')),
    path('', include('frontend.urls')),
    path('admin/', admin.site.urls),
]
