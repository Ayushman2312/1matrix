from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('create_ticket/', CreateTicketView.as_view(), name='create_ticket'),
]