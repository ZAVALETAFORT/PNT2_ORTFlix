import db from "./db.js";

// Respuesta de error con el formato { message }
export function error(status, message) {
  return Response.json({ message }, { status });
}

// Lee el body JSON; si viene vacío o roto devuelve {}
export async function leerBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// Pasan una fila de la base (snake_case) al formato del contrato (camelCase)
export function usuarioAJson(fila) {
  return { id: fila.id, nombre: fila.nombre, email: fila.email, rol: fila.rol };
}

export function salaAJson(fila) {
  return { id: fila.id, nombre: fila.nombre, filas: fila.filas, columnas: fila.columnas };
}

export function funcionAJson(fila) {
  return {
    id: fila.id,
    movieId: fila.movie_id,
    titulo: fila.titulo,
    salaId: fila.sala_id,
    fecha: fila.fecha,
    hora: fila.hora,
    formato: fila.formato,
    idioma: fila.idioma,
    precio: fila.precio,
  };
}

export function reservaAJson(fila) {
  const asientos = db
    .prepare("SELECT asiento FROM reserva_asientos WHERE reserva_id = ? ORDER BY asiento")
    .all(fila.id)
    .map((a) => a.asiento);

  return {
    id: fila.id,
    usuarioId: fila.usuario_id,
    funcionId: fila.funcion_id,
    asientos,
    estado: fila.estado,
    fechaCreacion: fila.fecha_creacion,
  };
}

// Asientos ocupados de una función (al cancelar una reserva sus asientos se borran, así que quedan libres)
export function asientosOcupados(funcionId, exceptoReservaId = 0) {
  return db
    .prepare("SELECT asiento FROM reserva_asientos WHERE funcion_id = ? AND reserva_id <> ? ORDER BY asiento")
    .all(funcionId, exceptoReservaId)
    .map((f) => f.asiento);
}
