// Datos de prueba con la MISMA forma que devuelve la API (ver README, "Contrato de datos").
// Sirven para trabajar mientras no está el backend. database/initDb.js carga estos mismos datos en la base.

// Fecha de hoy + N días ("AAAA-MM-DD"), así las funciones de ejemplo nunca quedan en el pasado
function enDias(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toLocaleDateString("en-CA");
}

export const usuarios = [
  { id: 1, nombre: "Admin ORTFlix", email: "admin@ortflix.com", rol: "admin" },
  { id: 2, nombre: "Cliente Demo", email: "cliente@ortflix.com", rol: "cliente" },
];

// Contraseñas de prueba (solo las usa el script de la base; la API nunca las devuelve)
export const credenciales = {
  "admin@ortflix.com": "admin123",
  "cliente@ortflix.com": "cliente123",
};

export const salas = [
  { id: 1, nombre: "Sala 1", filas: 8, columnas: 10 },
  { id: 2, nombre: "Sala 2", filas: 6, columnas: 8 },
];

// Horarios de cada día: [sala, hora]. Con 3 por día y 7 días hay 21 lugares, sin superponerse.
const HORARIOS = [[1, "18:00"], [2, "20:30"], [1, "22:00"]];
const FORMATOS = ["2D", "3D", "2D", "4D", "3D"];
const PRECIOS = { "2D": 8000, "3D": 9500, "4D": 12000 };

// Arma las funciones para una lista de películas ({ id, titulo }, con el id de TMDB):
// cada película tiene 2 funciones (las 3 primeras tienen 3), en días distintos de los próximos 7 días.
// La usan este mock y database/initDb.js (con las películas que trae de TMDB).
export function armarFunciones(peliculas) {
  const orden = [...peliculas, ...peliculas, ...peliculas.slice(0, 3)];

  return orden.map((pelicula, i) => {
    const [salaId, hora] = HORARIOS[i % HORARIOS.length];
    const formato = FORMATOS[i % FORMATOS.length];
    return {
      id: i + 1,
      movieId: pelicula.id,
      titulo: pelicula.titulo,
      salaId,
      fecha: enDias(Math.floor(i / HORARIOS.length) + 1),
      hora,
      formato,
      idioma: i % 2 === 0 ? "Subtitulada" : "Castellano",
      precio: PRECIOS[formato],
    };
  });
}

// Películas en cartelera en Argentina (id de TMDB). Se usan si no se puede consultar TMDB.
const PELICULAS = [
  { id: 791523, titulo: "Wildwood: El Bosque Salvaje" },
  { id: 1058424, titulo: "Hope" },
  { id: 1101412, titulo: "Fall 2: Deadpoint" },
  { id: 1283515, titulo: "Verity. La sombra de un engaño" },
  { id: 1423191, titulo: "Resident Evil" },
  { id: 1232569, titulo: "Pinocho: Desatado" },
  { id: 1400940, titulo: "Clayface" },
  { id: 1465063, titulo: "La isla olvidada" },
];

export const funciones = armarFunciones(PELICULAS);

// Dos reservas del cliente, en las funciones 2 y 4
export const reservas = [
  { id: 1, usuarioId: 2, funcionId: 2, asientos: ["A1", "A2"], estado: "confirmada", fechaCreacion: "2026-10-27T10:00:00" },
  { id: 2, usuarioId: 2, funcionId: 4, asientos: ["C5", "C6", "C7"], estado: "confirmada", fechaCreacion: "2026-10-27T11:30:00" },
];
