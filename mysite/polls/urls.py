from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/cursos", views.api_cursos, name="api-cursos"),
    path('api/curso/<str:columna>/<str:valor>/', views.api_curso_columna_valor, name='api-cursos-columna-valor'),
    path('api/curso/NRC/<int:nrc>/<str:tipo>', views.api_cursos_nrc_tipo, name='api-cursos-nrc-tipo'),
    path("api/todo", views.api_todo, name="api-todo"), # No usar, es solamente auxiliar
    path('course/<int:course_id>/', views.course_detail, name='course_detail'), #New Domingo
]