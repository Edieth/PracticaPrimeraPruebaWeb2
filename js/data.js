// Definición de rangos por generación
const generaciones = {
  1: { inicio: 1, fin: 151 },
  2: { inicio: 152, fin: 251 },
  3: { inicio: 252, fin: 386 },
  4: { inicio: 387, fin: 493 },
  5: { inicio: 494, fin: 649 }
};

// Botones y elementos de control, es decir, selecciona elementos de los botones de navegación.
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');

// Configuración de paginación, configura los valores iniciales de generación, página actual donde empieza los Pokémon y el último,
//así como la cantidad que se deben mostrar por página.
let currentPage = 1;
let generacionActual = 1;
let inicioGeneracion = generaciones[generacionActual].inicio;
let finGeneracion = generaciones[generacionActual].fin;
let pokemonsPerPage = 10;

//Se obtiene el estado guardado en localStorage
//Extrae parámetros de la URL como gen=1 o page=2
function obtenerParametro(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Mostrar nombre, imagen y número del Pokémon
function mostrarPokemonName(datosPokemon, contenedorNumero){
    const cardBodies = document.querySelectorAll('.card .card-body');
    const infoDiv = cardBodies[contenedorNumero];

    // Guardar generación y página actual antes de ir a detalle
    infoDiv.innerHTML = `
        <a href="detalle.html?id=${datosPokemon.id}" class="text-decoration-none text-dark" onclick="guardarEstado(${generacionActual}, ${currentPage})">
            <h4 class="pk-name">${datosPokemon.name.toUpperCase()}</h4>
            <img class="pk-img" src="${datosPokemon.sprites.other['official-artwork'].front_default}" />
            <p><strong>Número:</strong> ${datosPokemon.id}</p>
        </a>
    `;
}


// Cargar un Pokémon por su ID desde la API y para mostrarlo en la tarjeta correspondiente pasa los datos a la función de mostrarPokemonName.
function cargarPokemonPorID(id, posicion){
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => mostrarPokemonName(data, posicion))
        .catch(error => console.error("Error al cargar Pokémon:", error));
}

// Cargar una página completa de 10 Pokémon
function cargarPagina(pagina) {
  const totalPokemonsGeneracion = finGeneracion - inicioGeneracion + 1;
  const maxPage = Math.ceil(totalPokemonsGeneracion / pokemonsPerPage);
  const inicio = inicioGeneracion + (pagina - 1) * pokemonsPerPage;
  const fin = Math.min(inicio + pokemonsPerPage - 1, finGeneracion);

  const cardBodies = document.querySelectorAll('.card .card-body');
  cardBodies.forEach(body => body.innerHTML = '');

  let posicion = 0;
  for (let i = inicio; i <= fin; i++) {
    cargarPokemonPorID(i, posicion);
    posicion++;
  }

  actualizarControles(maxPage);
}

// Actualizar estado de los botones e indicador de página
function actualizarControles(maxPage) {
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === maxPage;

  pageIndicator.textContent = `Página ${currentPage} de ${maxPage}`;
}

// Eventos de navegación
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    cargarPagina(currentPage);
  }
});

nextButton.addEventListener('click', () => {
  const total = finGeneracion - inicioGeneracion + 1;
  const maxPage = Math.ceil(total / pokemonsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    cargarPagina(currentPage);
  }
});

// Carga los pokémon al cargar la página y establece la generación y página inicial desde los parámetros de la URL o localStorage 
window.onload = () => {
    const genParam = parseInt(obtenerParametro('gen')) || 1;
    const pageParam = parseInt(obtenerParametro('page')) || 1;

    if (generaciones[genParam]) {
        generacionActual = genParam;
        inicioGeneracion = generaciones[generacionActual].inicio;
        finGeneracion = generaciones[generacionActual].fin;
        currentPage = pageParam;
    }

    cargarPagina(currentPage);
};

//carga los datos de las generaciones
const generacionItems = document.querySelectorAll('.dropdown-item');

generacionItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const gen = parseInt(item.getAttribute('data-generacion'));
    if (generaciones[gen]) {
      generacionActual = gen;
      inicioGeneracion = generaciones[gen].inicio;
      finGeneracion = generaciones[gen].fin;
      currentPage = 1;
      cargarPagina(currentPage);
    }
  });
});
//Guarda la generación en la que se estaba antes de dar click para consultar los detalles de los Pokémon
//y página actual en localStorage para mantener el estado al volver.
function guardarEstado(gen, page) {
    localStorage.setItem('gen', gen);
    localStorage.setItem('page', page);
}


