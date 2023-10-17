// Realiza una solicitud GET a la URL de todos los cursos
const URL_BASE = window.location.origin

let DATA_CURSOS;

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

let searchInput = document.getElementById("searchInput");
let selectElement = document.getElementById("miSelect"); 


let tipoBusqueda = "TITULO"

let Agregar_ramo = (ramoSelect) => {
  // Aca debe estar la logica
  console.log("Elemento seleccionado: ", ramoSelect);
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
  });

  // Obtén el elemento de la lista de resultados
  let resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = ""; // Limpia la lista de resultados

  if (res.length > 0) {
      // Si hay resultados, muestra la lista de resultados
      document.querySelector(".search-results").style.display = "block";

      // Recorre los resultados y agrega elementos <li> a la lista de resultados
      for (let i = 0; i < Math.min(5, res.length); i++) {
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
