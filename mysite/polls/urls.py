from django.urls import path

from . import views

urlpatterns = [
    path("home/", views.index, name="index"),
    path("api/cursos", views.api_cursos, name="api-cursos"),
    path('api/curso/<str:columna>/<str:valor>/', views.api_curso_columna_valor, name='api-cursos-columna-valor'),
    path('api/curso/<int:nrc>/<str:tipo>', views.api_cursos_nrc_tipo, name='api-cursos-nrc-tipo'),
    path("api/todo", views.api_todo, name="api-todo"), # No usar, es solamente auxiliar
    
]