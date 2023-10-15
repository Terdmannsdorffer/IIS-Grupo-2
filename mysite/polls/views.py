from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import tablaRamos
import json


def index(request):
    return render(request, 'polls/home.html')

def api_cursos(request):
    pass