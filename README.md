# 🌐 Cómo Utilizar Entornos Virtuales 🌐

La forma correcta de trabajar en un proyecto de Django es mediante el uso de entornos virtuales. Esto garantiza que todo el equipo trabaje en las mismas condiciones. A continuación, un breve tutorial para quienes estén interesados en esto! 💡

## ✨ Creación del Entorno Virtual ✨

En primer lugar, debes crear el entorno virtual. Utiliza el siguiente comando:

```bash
python -m venv env
```

## 💡 Activación del Entorno 💡

Luego, activa el entorno de la siguiente manera, dependiendo de tu sistema operativo:

- Acceso mediante Linux/Mac:

    ```bash
    source venv/bin/activate
    ```

- Acceso mediante Windows:

    ```bash
    venv/Scripts/activate
    ```

## ⚙️ Desactivar Entorno ⚙️

Si deseas dejar de trabajar en el entorno virtual, es tan sencillo como ejecutar:

```bash
deactivate
```

## 📦 Instalación de Dependencias 📦

Continuando, es esencial instalar las dependencias para que todos trabajen en el mismo entorno. Para ello, utilizamos el archivo `requirements.txt`, donde se declaran las dependencias. Puedes instalarlas con el siguiente comando:

```bash
pip install -r requirements.txt
```

# 💾 Cargar Datos de Ramos 💾

Para que esto funcione
 es importante realizar las migraciones para tener una tabla donde subir la información:

```bash
python manage.py migrate
```

Una vez que la tabla esté creada, para cargar los datos, ejecuta el archivo encargado de esta tarea:

```bash
python cargar_ramos.py
```

En la consola, deberías ver las siguientes líneas:

```bash
Tabla Limpiada.
Comenzando a subir datos...
Datos subidos correctamente!!
```
Listo! 🐣

# 🧭 Acceso a End-Points 🧭
Se definidio una serie de endpoint para acceder desde el front-end de la web a los diferentes datos presentes en la base datos.Estos puntos de accesos son los siguientes

- Acceso a cursos **[GET]**
  - Link: `/api/cursos`
  - Respuesta: Respondera con el NRC y el titulo de todos los cursos

- Acceso a cursos segun NRC **[GET]**
  - Link: `/api/cursos/NRC/<NRC>`
  - Respuesta: Responda con todas las filas de un curso, segun el NRC entregado

- Acceso a horario del cursos segun NRC **[GET]**
  - Link: `/api/cursos/<NRC>/horario`
  - Respuesta: Responda con todas las filas de relacionados a las clases normales de un curso, segun el NRC entregado

- Acceso a pruebas del cursos segun NRC **[GET]**
  - Link: `/api/cursos/<NRC>/pruebas`
  - Respuesta: Responda con todas las filas de relacionados a las pruebas de un curso, segun el NRC entregado

- Acceso a examen del cursos segun NRC **[GET]**
  - Link: `/api/cursos/<NRC>/examen`
  - Respuesta: Responda con todas las filas de relacionados al examen de un curso, segun el NRC entregado



# 🔗 Enlaces utiles 🔗

## [📊Miro](https://miro.com/welcomeonboard/aVowMjBSend0ZEt0dDkwOFNXSE5zVGNCVzFFWWZQTnFKRk1qenZsQ3ZwTUxTdWxwajN4Q1NBSXNPdG0zUkJuT3wzNDU4NzY0NTI0OTgwNTY3ODMwfDI=?share_link_id=294707861775)

## [📑Trello](https://trello.com/b/jBEMMwqU/intro)