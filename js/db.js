const DB_NAME = "PokedexDB";
const DB_VERSION = 1;
let db;

function openDB(callback) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        if (callback) callback();
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // Crear store de entrenadores
        if (!db.objectStoreNames.contains("entrenadores")) {
            const store = db.createObjectStore("entrenadores", { keyPath: "id", autoIncrement: true });
        }

        // Crear store de equipos
        if (!db.objectStoreNames.contains("equipos")) {
            const store = db.createObjectStore("equipos", { keyPath: "id", autoIncrement: true });
        }
    };
}

function agregarEntrenador(entrenador, callback) {
    const transaction = db.transaction(["entrenadores"], "readwrite");
    const store = transaction.objectStore("entrenadores");
    const request = store.add(entrenador);
    request.onsuccess = function () {
        if (callback) callback();
    };
}

function obtenerEntrenadores(callback) {
    const transaction = db.transaction(["entrenadores"], "readonly");
    const store = transaction.objectStore("entrenadores");
    const request = store.getAll();
    request.onsuccess = function (event) {
        callback(event.target.result);
    };
}

function agregarEquipo(equipo, callback) {
    const transaction = db.transaction(["equipos"], "readwrite");
    const store = transaction.objectStore("equipos");
    const request = store.add(equipo);
    request.onsuccess = function () {
        if (callback) callback();
    };
}

function obtenerEquipos(callback) {
    const transaction = db.transaction(["equipos"], "readonly");
    const store = transaction.objectStore("equipos");
    const request = store.getAll();
    request.onsuccess = function (event) {
        callback(event.target.result);
    };
}
