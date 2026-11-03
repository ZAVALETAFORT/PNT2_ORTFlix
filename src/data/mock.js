// Datos de prueba con la MISMA forma que devuelve la API (ver README, "Contrato de datos").
// Sirven para trabajar mientras no está el backend. database/initDb.js carga estos mismos datos en la base.

// Fecha de hoy + N días ("AAAA-MM-DD"), así las funciones de ejemplo nunca quedan en el pasado.
// Hay que volver a correr npm run db:init para que se recalculen.
export function enDias(dias) {
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

// movieId = id de la película en TMDB (en cartel en Argentina).
// 17 funciones en los próximos 7 días, con formatos 2D, 3D y 4D, ambos idiomas y varias películas
// con más de una función (para probar el detalle agrupado por día). No hay dos funciones en la
// misma sala, fecha y hora.
export const funciones = [
  // Mañana
  { id: 1, movieId: 791523, titulo: "Wildwood: El Bosque Salvaje", salaId: 2, fecha: enDias(1), hora: "18:00", formato: "2D", idioma: "Castellano", precio: 8000 },
  { id: 2, movieId: 1400940, titulo: "Clayface", salaId: 1, fecha: enDias(1), hora: "20:30", formato: "3D", idioma: "Subtitulada", precio: 9500 },
  { id: 3, movieId: 1423191, titulo: "Resident Evil", salaId: 2, fecha: enDias(1), hora: "22:00", formato: "4D", idioma: "Castellano", precio: 12000 },
  // En 2 días
  { id: 4, movieId: 1153576, titulo: "Street Fighter", salaId: 1, fecha: enDias(2), hora: "18:00", formato: "2D", idioma: "Subtitulada", precio: 8000 },
  { id: 5, movieId: 1232569, titulo: "Pinocho: Desatado", salaId: 1, fecha: enDias(2), hora: "21:00", formato: "2D", idioma: "Castellano", precio: 8000 },
  { id: 6, movieId: 1058424, titulo: "Hope", salaId: 2, fecha: enDias(2), hora: "21:15", formato: "2D", idioma: "Castellano", precio: 8000 },
  // En 3 días
  { id: 7, movieId: 1400940, titulo: "Clayface", salaId: 1, fecha: enDias(3), hora: "18:30", formato: "2D", idioma: "Castellano", precio: 8000 },
  { id: 8, movieId: 1400837, titulo: "La otra madre", salaId: 2, fecha: enDias(3), hora: "20:30", formato: "2D", idioma: "Subtitulada", precio: 8000 },
  { id: 9, movieId: 1423191, titulo: "Resident Evil", salaId: 1, fecha: enDias(3), hora: "22:15", formato: "3D", idioma: "Subtitulada", precio: 9500 },
  // En 4 días
  { id: 10, movieId: 791523, titulo: "Wildwood: El Bosque Salvaje", salaId: 2, fecha: enDias(4), hora: "19:00", formato: "3D", idioma: "Castellano", precio: 9500 },
  { id: 11, movieId: 1153576, titulo: "Street Fighter", salaId: 1, fecha: enDias(4), hora: "20:30", formato: "3D", idioma: "Subtitulada", precio: 9500 },
  // En 5 días
  { id: 12, movieId: 1232569, titulo: "Pinocho: Desatado", salaId: 2, fecha: enDias(5), hora: "18:00", formato: "2D", idioma: "Castellano", precio: 8000 },
  { id: 13, movieId: 1058424, titulo: "Hope", salaId: 1, fecha: enDias(5), hora: "21:00", formato: "2D", idioma: "Subtitulada", precio: 8000 },
  // En 6 días
  { id: 14, movieId: 1400940, titulo: "Clayface", salaId: 1, fecha: enDias(6), hora: "19:45", formato: "3D", idioma: "Subtitulada", precio: 9500 },
  { id: 15, movieId: 1400837, titulo: "La otra madre", salaId: 2, fecha: enDias(6), hora: "21:30", formato: "2D", idioma: "Castellano", precio: 8000 },
  // En 7 días
  { id: 16, movieId: 1423191, titulo: "Resident Evil", salaId: 2, fecha: enDias(7), hora: "20:00", formato: "4D", idioma: "Subtitulada", precio: 12000 },
  { id: 17, movieId: 1153576, titulo: "Street Fighter", salaId: 1, fecha: enDias(7), hora: "22:00", formato: "2D", idioma: "Castellano", precio: 8000 },
];

// Dos reservas del cliente: Clayface (mañana) y Street Fighter (en 2 días)
export const reservas = [
  { id: 1, usuarioId: 2, funcionId: 2, asientos: ["A1", "A2"], estado: "confirmada", fechaCreacion: "2026-10-27T10:00:00" },
  { id: 2, usuarioId: 2, funcionId: 4, asientos: ["C5", "C6", "C7"], estado: "confirmada", fechaCreacion: "2026-10-27T11:30:00" },
];
