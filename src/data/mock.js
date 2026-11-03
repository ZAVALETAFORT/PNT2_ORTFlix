// Datos de prueba con la MISMA forma que devuelve la API (ver README, "Contrato de datos").
// Sirven para trabajar mientras no está el backend. scripts/init-db.js carga estos mismos datos en la base.

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

// movieId = id de la película en TMDB (en cartel en Argentina)
export const funciones = [
  { id: 1, movieId: 1400940, titulo: "Clayface", salaId: 1, fecha: "2026-10-28", hora: "20:30", formato: "3D", idioma: "Subtitulada", precio: 9500 },
  { id: 2, movieId: 1423191, titulo: "Resident Evil", salaId: 2, fecha: "2026-10-29", hora: "22:00", formato: "4D", idioma: "Castellano", precio: 12000 },
  { id: 3, movieId: 1153576, titulo: "Street Fighter", salaId: 1, fecha: "2026-10-30", hora: "18:00", formato: "2D", idioma: "Subtitulada", precio: 8000 },
  { id: 4, movieId: 1058424, titulo: "Hope", salaId: 2, fecha: "2026-11-02", hora: "21:15", formato: "2D", idioma: "Castellano", precio: 8000 },
];

export const reservas = [
  { id: 1, usuarioId: 2, funcionId: 1, asientos: ["A1", "A2"], estado: "confirmada", fechaCreacion: "2026-10-27T10:00:00" },
  { id: 2, usuarioId: 2, funcionId: 3, asientos: ["C5", "C6", "C7"], estado: "confirmada", fechaCreacion: "2026-10-27T11:30:00" },
];
