// Función para obtener parámetros de la URL
function obtenerParametro(nombre) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nombre);
}

// Función para mostrar todos los datos del Pokémon
function mostrarPokemon(datosPokemon){
    const infoDiv = document.getElementById('pokemon-detail');
    infoDiv.innerHTML = `
        <h2 class="pk-name">${datosPokemon.name.toUpperCase()}</h2>
        <img class="pk-img mb-3" src="${datosPokemon.sprites.other['official-artwork'].front_default}" />
        <p><strong>Número:</strong> ${datosPokemon.id}</p>
        <p><strong>Peso:</strong> ${datosPokemon.weight / 10} kg</p>
        <p><strong>Altura:</strong> ${datosPokemon.height / 10} m</p>
        <p><strong>Tipos:</strong> ${datosPokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Habilidades:</strong> ${datosPokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <p><strong>Movimientos:</strong> ${datosPokemon.moves.slice(0, 6).map(m => m.move.name).join(', ')}</p>
    `;
}

// Obtener ID desde la URL y buscar el Pokémon
window.onload = () => {
    const id = obtenerParametro('id');
    // Crear enlace de regreso con generación y página
    const gen = localStorage.getItem('gen') || 1;
    const page = localStorage.getItem('page') || 1;
    const btnVolver = document.getElementById('btn-volver');
        btnVolver.href = `index.html?gen=${gen}&page=${page}`;
        //Obtener el ID del Pokémon desde la URL
    if (id) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => mostrarPokemon(data))
            .catch(() => {
                document.getElementById('pokemon-detail').innerHTML = `<p class="text-danger">Pokémon no encontrado</p>`;
            });
    } else {
        document.getElementById('pokemon-detail').innerHTML = `<p class="text-danger">ID no proporcionado</p>`;
    }
};
