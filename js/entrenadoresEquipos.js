// Mostrar lista de entrenadores
function mostrarEntrenadores() {
    openDB(() => {
        obtenerEntrenadores(entrenadores => {
            const contenedor = document.getElementById("lista-entrenadores");
            contenedor.innerHTML = "";
            entrenadores.forEach(ent => {
                contenedor.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="${ent.foto}" class="card-img-top" alt="Foto">
                            <div class="card-body">
                                <h5 class="card-title">${ent.nombre}</h5>
                                <p class="card-text">
                                    Sexo: ${ent.sexo}<br>
                                    Residencia: ${ent.residencia}
                                </p>
                            </div>
                        </div>
                    </div>`;
            });
        });
    });
}

// Mostrar lista de equipos
function mostrarEquipos() {
    openDB(() => {
        obtenerEquipos(equipos => {
            obtenerEntrenadores(entrenadores => {
                const contenedor = document.getElementById("lista-equipos");
                contenedor.innerHTML = "";

                equipos.forEach(eq => {
                    const entrenador = entrenadores.find(e => e.id === eq.idEntrenador);
                    const pokemonesHTML = eq.pokemones.map(p => `
                        <li class="list-group-item d-flex align-items-center">
                            <img src="${p.imagen}" width="50" class="me-2"> ${p.nombre}
                        </li>`).join("");

                    contenedor.innerHTML += `
                        <div class="col-md-6 mb-4">
                            <div class="card">
                                <img src="${eq.imagenEquipo}" class="card-img-top" alt="Equipo">
                                <div class="card-body">
                                    <h5 class="card-title">${eq.nombreEquipo}</h5>
                                    <p><strong>Entrenador:</strong> ${entrenador ? entrenador.nombre : 'Desconocido'}</p>
                                    <ul class="list-group">${pokemonesHTML}</ul>
                                </div>
                            </div>
                        </div>`;
                });
            });
        });
    });
}

// Cargar entrenadores en el select del formulario de equipo
function cargarEntrenadoresSelect() {
    openDB(() => {
        obtenerEntrenadores(entrenadores => {
            const select = document.getElementById("idEntrenador");
            select.innerHTML = ""; // limpiar si ya tenía opciones
            entrenadores.forEach(e => {
                const option = document.createElement("option");
                option.value = e.id;
                option.textContent = e.nombre;
                select.appendChild(option);
            });
        });
    });
}

// Agregar Pokémon al formulario
function agregarPokemon() {
    const contenedor = document.getElementById("pokemones-container");
    const divsActuales = contenedor.querySelectorAll("input[name='nombrePokemon']");
    if (divsActuales.length >= 6) {
        alert("Máximo 6 Pokémones por equipo");
        return;
    }
    const div = document.createElement("div");
    div.classList.add("mb-2");
    div.innerHTML = `
        <input type="text" class="form-control mb-1" placeholder="Nombre del Pokémon" name="nombrePokemon" required>
        <input type="url" class="form-control" placeholder="URL imagen del Pokémon" name="imagenPokemon" required>
    `;
    contenedor.appendChild(div);
}

// Guardar los datos del entrenador recibidos desde el formulario 
function guardarEntrenador(event) {
    event.preventDefault();
    openDB(() => {
        const entrenador = {
            nombre: document.getElementById("nombre").value,
            sexo: document.getElementById("sexo").value,
            residencia: document.getElementById("residencia").value,
            foto: document.getElementById("foto").value
        };
        agregarEntrenador(entrenador, () => {
            alert("Entrenador guardado correctamente");
            document.getElementById("formEntrenador").reset();
        });
    });
}

// Guardar los datos recibidos equipo desde el formulario 
function guardarEquipo(event) {
    event.preventDefault();

    const nombreEquipo = document.getElementById("nombreEquipo").value;
    const imagenEquipo = document.getElementById("imagenEquipo").value;
    const idEntrenador = parseInt(document.getElementById("idEntrenador").value);

    const nombres = document.getElementsByName("nombrePokemon");
    const imagenes = document.getElementsByName("imagenPokemon");

    const pokemones = [];
    for (let i = 0; i < nombres.length; i++) {
        if (nombres[i].value && imagenes[i].value) {
            pokemones.push({ nombre: nombres[i].value, imagen: imagenes[i].value });
        }
    }

    const equipo = {
        nombreEquipo,
        imagenEquipo,
        idEntrenador,
        pokemones
    };

    openDB(() => {
        agregarEquipo(equipo, () => {
            alert("Equipo guardado correctamente");
            document.getElementById("formEquipo").reset();
            document.getElementById("pokemones-container").innerHTML = "";
        });
    });
}
