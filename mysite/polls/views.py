from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from .models import tablaRamos
from django.db.models import Q
from django.shortcuts import render, get_object_or_404


def index(request):
    return render(request, 'polls/home.html')

def api_todo(request):
    if request.method == 'GET':
        # Realiza la consulta para obtener todos los registros de la tablaRamos
        registros = tablaRamos.objects.all()

        # Crea una lista de diccionarios con los datos de los registros
        datos = [
            {
                'PERIODO': registro.PERIODO,
                'PLAN_DE_ESTUDIOS': registro.PLAN_DE_ESTUDIOS,
                'ESCUELA': registro.ESCUELA,
                'NRC': registro.NRC,
                'CONECTOR_LIGA': registro.CONECTOR_LIGA,
                'LISTA_CRUZADA': registro.LISTA_CRUZADA,
                'MATERIA': registro.MATERIA,
                'CURSO': registro.CURSO,
                'SECCION': registro.SECCION,
                'TITULO': registro.TITULO,
                'CREDITO': registro.CREDITO,
                'LUNES': registro.LUNES,
                'MARTES': registro.MARTES,
                'MIERCOLES': registro.MIERCOLES,
                'JUEVES': registro.JUEVES,
                'VIERNES': registro.VIERNES,
                'SABADO': registro.SABADO,
                'DOMINGO': registro.DOMINGO,
                'INICIO': registro.INICIO.strftime('%Y-%m-%d') if registro.INICIO else '',
                'FIN': registro.FIN.strftime('%Y-%m-%d') if registro.FIN else '',
                'TIPO': registro.TIPO,
                'PROFESOR': registro.PROFESOR,
                'SALA': registro.SALA,
            }
            for registro in registros
        ]

        # Devuelve los datos en formato JSON
        return JsonResponse(datos, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def api_cursos(request):
    if request.method == 'GET':
        registros = tablaRamos.objects.values('NRC', 'TITULO', 'PROFESOR').distinct()          
        return JsonResponse(list(registros), safe=False)                      
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def api_curso_columna_valor(request, columna, valor):
    if request.method == 'GET':
        columnas_validas = ['PERIODO', 'PLAN_DE_ESTUDIOS', 'ESCUELA', 'NRC', 'CONECTOR_LIGA', 'LISTA_CRUZADA', 'MATERIA', 'CURSO', 'SECCION', 'TITULO', 'CREDITO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO', 'INICIO', 'FIN', 'TIPO', 'PROFESOR', 'SALA']

        # Verifica si la columna proporcionada está mapeada
        if columna in columnas_validas:
            campo = columna
            registros = tablaRamos.objects.filter(**{campo: valor}).values()
            registros_lista = list(registros)
            if not registros_lista:
                respuesta = {'error': f'No se encontraron registros que coincidan con {columna}={valor}'}
                return JsonResponse(respuesta, status=404)
            return JsonResponse(registros_lista, safe=False, status=200)
        else:
            respuesta = {'error': f'La columna {columna} no es valida'}
            return JsonResponse(respuesta, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

def api_cursos_nrc_tipo(request, nrc, tipo):
    if tipo != None: tipo = tipo.lower()
    if request.method == 'GET':
        registros = tablaRamos.objects.filter(NRC=nrc)
        registros_lista = list(registros.values())     
        if not registros_lista:  
            return JsonResponse({'error': 'NRC no encontrado'}, status=404)   
        
        elif tipo == "horario":
            registros_lista = list(registros.filter(~Q(TIPO__regex=r"(^PR.*)|(^EX.*)")).values('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO','TIPO', "SALA" ))   
            return JsonResponse(registros_lista, safe=False)      
        elif tipo == "pruebas":
            registros_lista = list(registros.filter(Q(TIPO__regex=r"(^PR.*)")).values())   
            return JsonResponse(registros_lista, safe=False)  
        elif tipo == "examen":
            registros_lista = list(registros.filter(Q(TIPO__regex=r"(^EX.*)")).values())   
            return JsonResponse(registros_lista, safe=False)    
        else:
            return JsonResponse({'error': 'Método no permitido'}, status=405)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


