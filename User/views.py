from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.views import View
from masteradmin.models import Tickets
from django.http import JsonResponse
# Create your views here.

class DashboardView(TemplateView):
    template_name = 'user_dashboard/base.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context[""] = 
        return context

class CreateTicketView(View):
    def post(self, request):
        try:
            department = request.POST.get('department')
            name = request.POST.get('title') 
            problem = request.POST.get('description')
            attachment = request.FILES.get('attachment')

            # Create new ticket
            ticket = Tickets.objects.create(
                name=name,
                department=department,
                problem=problem
            )

            # Handle file attachment if present
            if attachment:
                ticket.attachment = attachment
                ticket.save()

            # Return JSON response
            return JsonResponse({
                'status': 'success',
                'message': 'Support ticket created successfully!',
                'ticket_id': ticket.id
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })




