export const salas = [
  { id: 1, nombre: "Sala 1", filas: 5, columnas: 8 },
  { id: 2, nombre: "Sala 2", filas: 6, columnas: 10 },
  { id: 3, nombre: "Sala 3", filas: 4, columnas: 7 },
];

export const funciones = [
  {
    id: 1,
    pelicula: "Interstellar",
    fecha: "2026-10-29",
    hora: "20:00",
    formato: "2D",
    idioma: "Subtitulada",
    salaId: 1,
    precio: 4500,
  },
  {
    id: 2,
    pelicula: "Interstellar",
    fecha: "2026-10-30",
    hora: "22:00",
    formato: "IMAX",
    idioma: "Subtitulada",
    salaId: 2,
    precio: 5200,
  },
  {
    id: 3,
    pelicula: "Dune: Parte Dos",
    fecha: "2026-10-31",
    hora: "19:30",
    formato: "3D",
    idioma: "Doblada",
    salaId: 3,
    precio: 4800,
  },
  {
    id: 4,
    pelicula: "Dune: Parte Dos",
    fecha: "2026-11-01",
    hora: "21:30",
    formato: "2D",
    idioma: "Subtitulada",
    salaId: 1,
    precio: 4300,
  },
  {
    id: 5,
    pelicula: "Matrix",
    fecha: "2026-10-20",
    hora: "18:00",
    formato: "2D",
    idioma: "Subtitulada",
    salaId: 2,
    precio: 4000,
  },
];

export const reservasMock = [
  {
    id: 1,
    usuarioId: 1,
    funcionId: 1,
    asientos: ["A1", "A2"],
    estado: "confirmada",
    creadaEn: "2026-10-27T10:00:00.000Z",
  },
  {
    id: 2,
    usuarioId: 1,
    funcionId: 3,
    asientos: ["B3", "B4", "B5"],
    estado: "cancelada",
    creadaEn: "2026-10-25T10:00:00.000Z",
  },
  {
    id: 3,
    usuarioId: 1,
    funcionId: 5,
    asientos: ["C1", "C2"],
    estado: "confirmada",
    creadaEn: "2026-10-20T10:00:00.000Z",
  },
  {
    id: 4,
    usuarioId: 2,
    funcionId: 1,
    asientos: ["A3", "A4"],
    estado: "confirmada",
    creadaEn: "2026-10-27T11:00:00.000Z",
  },
];

export function getSalaById(salaId) {
  return salas.find((sala) => sala.id === salaId) ?? null;
}

export function getFuncionById(funcionId) {
  return funciones.find((funcion) => funcion.id === funcionId) ?? null;
}

export function getFechaHoraFuncion(funcion) {
  return new Date(`${funcion.fecha}T${funcion.hora}:00`);
}
