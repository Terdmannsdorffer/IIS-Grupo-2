// Realiza una solicitud GET a la URL de todos los cursos
const URL_BASE = 'http://127.0.0.1:8000'

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

  console.log(res)

  if (res.length > 0) {
      // Si hay resultados, muestra la lista de resultados
      document.querySelector(".search-results").style.display = "block";

      // Recorre los resultados y agrega elementos <li> a la lista de resultados
      for (let i = 0; i < Math.min(5, res.length); i++) {
        let result = res[i];
        let item = document.createElement("li");
        // Supongamos que 'result' tiene tres propiedades: result.prop1, result.prop2, result.prop3
        item.textContent = `NRC: ${result.NRC}, Titulo: ${result.TITULO}, Profesor: ${result.PROFESOR}`;
        resultsList.appendChild(item);
    }
  } else {
      // Si no hay resultados, oculta la lista de resultados
      document.querySelector(".search-results").style.display = "none";
  }
};


selectElement.addEventListener("change", function () {
  tipoBusqueda = selectElement.value;
  console.log("Valor seleccionado: " + tipoBusqueda);
  
});

searchInput.addEventListener("input", busqueda);
searchInput.addEventListener("focus", busqueda);
