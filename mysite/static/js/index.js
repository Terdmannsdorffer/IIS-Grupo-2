document.addEventListener('DOMContentLoaded', function() {
// Realiza una solicitud GET a la URL de todos los cursos
const URL_BASE = window.location.origin

// DOM VARS
let searchInput = document.getElementById("searchInput");
let selectElement = document.getElementById("miSelect"); 

// AUX VARS
let DATA_CURSOS;
let ramosSelected = []
let tipoBusqueda = "TITULO"
const diaSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
const banned_words = [
  "de", "a", "en", "con", "por", "para", "sin", "ante", "sobre",
  "entre", "tras", "durante", "según", "mediante", "y", "o", "pero", "aunque",
  "porque", "si", "cuando", "mientras", "así que", "por lo tanto", "además",
  "por otro lado", "sin embargo", "por tanto", "de hecho", "e", "y", "la"
];

fetch(URL_BASE+'/api/cursos')
  .then(response => {
    if (response.ok) {
      // Si la respuesta es exitosa, convierte la respuesta a JSON
      return response.json();
    }
    throw new Error('Error al obtener los datos');
  })
  .then(data => {
    // Imprime la respuesta en la consola
    DATA_CURSOS = data;
    console.log(data);
  })
  .catch(error => {
    // Maneja errores de solicitud
    console.error(error);
  });

let stringToColorCode = (inputString) => {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = (hash * 397) ^ (inputString.charCodeAt(i) * 743);
  }
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - color.length) + color;
}

function lightenColor(hex, factor) {
  // Parse el color HEX a RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Aumenta los componentes de color
  r = Math.min(255, r + factor);
  g = Math.min(255, g + factor);
  b = Math.min(255, b + factor);

  // Convierte de nuevo a HEX
  const newHex = `${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

  return newHex;
}

function esColorClaro(hexColor, umbral = 128) {
  // Convierte el color hexadecimal a valores RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calcula la luminancia
  const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;

  // Compara la luminancia con el umbral
  return luminancia > umbral;
}

let make_color = (base, tipo="C") => {
  const sumaDigitos = (numero) => numero.toString().split('').reduce((suma, digito) => suma + parseInt(digito, 10), 0);
  const type = sumaDigitos(base)
  const new_base = stringToColorCode(String(base))
  const hex_base = "F1"
  console.log(type)
  let result;
  if (base%2) {
    result = "#" + new_base[1] + new_base[2] + hex_base + new_base[0] + new_base[3]
  }
  else {
    result = "#" + new_base[3] + new_base[0] + new_base[2] + new_base[1] + hex_base
  }
  
  factor = esColorClaro(result) ? 0 : 100
  if (tipo != "C") {
    
    factor += 30
    console.log("Is ayun")
    
  }
  console.log(factor)
  
  return lightenColor(result, factor)
}

const resume_title = (title) => {
  const palabras = title.split(' ');
  const iniciales = palabras
    .filter(palabra => !banned_words.includes(palabra.toLowerCase()))
    .map(palabra => palabra[0])
    .slice(0, 5);
  return iniciales.join('');
};

let refresh_horario = () => {
  actualizar_lista();
  actualizar_horario();
  actualizar_creditos();
  check_ramos();
}

let check_ramos = () => {
  let contenedor = document.getElementById("clean-all");
  contenedor.innerHTML = "";


  if (ramosSelected.length != 0) {
    // Crear el elemento de limpieza
    const link = document.createElement("a");
    link.href = "#";
    link.className = "link-danger";

    // Agregar el evento de clic
    link.addEventListener("click", remove_all);

    link.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
    </svg>`

    // Agregar el enlace al contenedor
    contenedor.appendChild(link);
  }
};

let remove_all = () => {
  ramosSelected = []
  refresh_horario();
  localStorage.removeItem('ramosSelectedSave');
}

let get_HorarioNrc = (nrcRamo) => {
  return fetch(URL_BASE+'/api/curso/NRC/' + nrcRamo + '/horario')
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, convierte la respuesta a JSON y retorna la promesa
        return response.json();
      }
      throw new Error('Error al obtener los datos');
    })
    .catch(error => {
      // Maneja errores de solicitud
      console.error(error);
    });
}

let get_RamoNrc = (nrcRamo) => {
  return fetch(URL_BASE+'/api/curso/NRC/' + nrcRamo)
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, convierte la respuesta a JSON y retorna la promesa
        return response.json();
      }
      throw new Error('Error al obtener los datos');
    })
    .catch(error => {
      // Maneja errores de solicitud
      console.error(error);
    });
}

let actualizar_horario = () => {
  crearHorario();
  console.log("actualizar_horario")
  ramosSelected.map(ramo => {
    get_HorarioNrc(ramo.NRC).then(data => {
      console.log(ramo)
      data.map(clase => {
        console.log(clase)
        diaSemana.map(dia =>{
          if (clase[dia] != "") {
            let startClase = clase[dia].split("-")[0]
            let EndClase = clase[dia].split("-")[1]
            for (let i = parseInt(startClase.split(":")[0]); `${i}:20` != EndClase; i++) {
              console.log(`${dia} ${startClase} ${EndClase}`)
              console.log("ADD HOUR")
              let celda = document.getElementById(`${i}-${dia}`);
              if (celda.innerHTML == "") {
                celda.style.backgroundColor = "";
              }
              else {
                mostrarNotificacion();
                celda.style.backgroundColor = "#F88379";
              }
              celda.innerHTML += `<p 
                                  style="background-color: #${make_color(ramo.NRC, clase.TIPO[0])};
                                  padding: 5px;
                                  border-radius: 5px;
                                  font-weight: bold;
                                  margin: 0px;
                                  ">[${clase.TIPO[0]}] ${resume_title(ramo.TITULO)}</p>`
              
            }
            
          }
        })
      })
    }).catch(error => {
      console.error(error);
    });
  });
}

let actualizar_lista = () => {
  let contenedor = document.getElementById("ListaRamos");
  contenedor.innerHTML = ""
  ramosSelected.map(ele => {
    // Variables con los datos a reemplazar
    var ramo = ele.TITULO;
    var profesor = ele.PROFESOR;
    var nrc = ele.NRC;
    var color_nrc = make_color(nrc)

    // Crea un nuevo elemento <a>
    var nuevoElemento = document.createElement("a");
    nuevoElemento.href = "#";
    nuevoElemento.className = "list-group-item list-group-item-action flex-column align-items-start";
    nuevoElemento.style.backgroundColor = "#" + color_nrc;

    nuevoElemento.addEventListener("click", function() {
      // Obtiene el valor del nrc del elemento
      var nrcValue = nrc;
      eliminar_ramo(nrc);
    });

    let isMouseHover = false
    nuevoElemento.addEventListener("mouseleave", function (event) {
      nuevoElemento.classList.remove("list-group-item-danger");
      nuevoElemento.style.backgroundColor = "#" + color_nrc;
      
    }, false);
    nuevoElemento.addEventListener("mouseover", function (event) {
      nuevoElemento.classList.add("list-group-item-danger");
      nuevoElemento.removeAttribute("style");
    }, false);


    // Contenido HTML del nuevo elemento
    nuevoElemento.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">[${resume_title(ramo)}] ${ramo}</h5>
        <small>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
      </small>
      </div>
      <p class="mb-1">Profesor: ${profesor}</p>
      <small>NRC: ${nrc}</small>
    `;

    // Agrega el nuevo elemento al contenedor
    contenedor.appendChild(nuevoElemento)

  })

}

let actualizar_creditos = () => {
  let creditCounter = document.getElementById("CreditValue");
  let counter = 0
  creditCounter.innerHTML = 0
  ramosSelected.map(ramo => {
    get_RamoNrc(ramo.NRC).then(data => {
      counter += parseInt(data[0].CREDITO)
      creditCounter.innerHTML = counter
      return
    })
  })
}


let eliminar_ramo = (nrcRamo) => {
  console.log(nrcRamo)
  console.log("Borrado")
  ramosSelected = ramosSelected.filter(elemento => elemento.NRC !== nrcRamo);
  refresh_horario();
  localStorage.setItem('ramosSelectedSave', JSON.stringify(ramosSelected));
}

let Agregar_ramo = (ramoSelect) => {
  // Aca debe estar la logica
  console.log("Elemento seleccionado: ", ramoSelect);
  ramosSelected.push(ramoSelect)
  refresh_horario();
  console.log(ramosSelected)
  localStorage.setItem('ramosSelectedSave', JSON.stringify(ramosSelected));
  
}

let crearHorario = () => {
  let tabla = document.getElementById("horario");
  tabla.innerHTML = ""
  for (let i = 8; i < 20; i++) {
    // Obtén una referencia al elemento tbody
    

    // Crea un nuevo elemento <tr>
    var nuevoFila = document.createElement("tr");
    nuevoFila.classList.add("equal-row");
    // Define el contenido HTML para la nueva fila
    nuevoFila.innerHTML = '<th scope="row">'+ `${i}:30` +'</th>' +
                        '<th scope="row">'+ `${i+1}:20` +'</th>' +
                        '<td' + ` id="${i}-LUNES"` +  '></td>' +
                        '<td' + ` id="${i}-MARTES"` +  '></td>' +
                        '<td' + ` id="${i}-MIERCOLES"` +  '></td>' +
                        '<td' + ` id="${i}-JUEVES"` +  '></td>' +
                        '<td' + ` id="${i}-VIERNES"` +  '></td>' +
                        '<td' + ` id="${i}-SABADO"` +  '></td>' +
                        '<td' + ` id="${i}-DOMINGO"` +  '></td>';

    // Agrega la nueva fila al tbody
    tabla.appendChild(nuevoFila);
  }
}

let busqueda = () => {
  let searchText = searchInput.value.toLowerCase();
  console.log('Texto de búsqueda: ' + searchText);

  if (searchText == "") {
      // Si no hay texto de búsqueda, oculta la lista de resultados
      document.querySelector(".search-results").style.display = "none";
      return;
  }

  const regex = new RegExp(searchText.toString(), 'i');
  let res = DATA_CURSOS.filter(elemento => {
      return regex.test(elemento[tipoBusqueda].toString());
  }).filter(elementoRes => {
    return !ramosSelected.some(elementoRamo => elementoRamo.NRC === elementoRes.NRC);
  });

  // Obtén el elemento de la lista de resultados
  let resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = ""; // Limpia la lista de resultados

  if (res.length > 0) {
      // Si hay resultados, muestra la lista de resultados
      document.querySelector(".search-results").style.display = "block";

      // Recorre los resultados y agrega elementos <li> a la lista de resultados
      for (let i = 0; i < res.length; i++) {
        let result = res[i];
    
        let title = document.createElement("h5");
        title.textContent = result.TITULO;
        
        let professor = document.createElement("h6");
        professor.textContent = result.PROFESOR;
        
        let nrc = document.createElement("p");
        nrc.textContent = `NRC: ${result.NRC}`;
        
        let item = document.createElement("li");
        item.appendChild(title);
        item.appendChild(professor);
        item.appendChild(nrc);
        
        item.addEventListener("click", function() {
          document.querySelector(".search-results").style.display = "none";
          Agregar_ramo(result)
        });

        //Agregar elemento a la lista
        resultsList.appendChild(item);
    }
  } else {
    document.querySelector(".search-results").style.display = "none";
  }
};

let SaveHorario = () => {
  console.log("saveeee")
  const elementToConvert = document.getElementById('MainTable'); 

  html2canvas(elementToConvert).then(function(canvas) {
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi_imagen.png'; // Nombre predeterminado del archivo
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Libera el recurso URL
        URL.revokeObjectURL(url);
    });
  });
}

let mostrarNotificacion = () => {
  var notification = document.getElementById("notification");
  notification.style.display = "block";
  setTimeout(function() {
      cerrarNotificacion();
  }, 5000); // 10000 ms = 10 segundos
}

let cerrarNotificacion = () => {
  var notification = document.getElementById("notification");
  notification.style.display = "none";
}

selectElement.addEventListener("change", function () {
  tipoBusqueda = selectElement.value;
  console.log("Valor seleccionado: " + tipoBusqueda);
  
});

searchInput.addEventListener("input", busqueda);
searchInput.addEventListener("focus", busqueda);

document.addEventListener("click", function(event) {
  if (event.target !== searchInput) {
    document.querySelector(".search-results").style.display = "none";
  }
});


crearHorario();

if (localStorage.getItem('ramosSelectedSave') !== null) {
  ramosSelected = JSON.parse(localStorage.getItem('ramosSelectedSave'));
  console.log(ramosSelected);
  refresh_horario();
}


document.getElementById('SaveHorarioBtn').addEventListener('click', SaveHorario);



});