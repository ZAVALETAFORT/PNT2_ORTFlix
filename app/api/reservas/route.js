import db from "@/lib/db";
import { obtenerUsuario } from "@/lib/auth";
import { error, leerBody, reservaAJson, asientosOcupados } from "@/lib/api";
import { validarAsientos } from "@/lib/validar";

// Reservas del usuario del token
export async function GET(request) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  const reservas = db
    .prepare("SELECT * FROM reservas WHERE usuario_id = ? ORDER BY id")
    .all(usuario.id);
  return Response.json(reservas.map(reservaAJson));
}

export async function POST(request) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  const { funcionId, asientos } = await leerBody(request);
  if (!funcionId) return error(400, "Falta la función.");

  const funcion = db.prepare("SELECT * FROM funciones WHERE id = ?").get(funcionId);
  if (!funcion) return error(404, "La función no existe.");

  const sala = db.prepare("SELECT * FROM salas WHERE id = ?").get(funcion.sala_id);
  const mensaje = validarAsientos(asientos, sala);
  if (mensaje) return error(400, mensaje);

  // Si algún asiento ya está ocupado, no se crea nada
  const ocupados = asientosOcupados(funcion.id);
  if (asientos.some((a) => ocupados.includes(a))) {
    return error(409, "Alguno de los asientos ya está ocupado.");
  }

  const resultado = db
    .prepare("INSERT INTO reservas (usuario_id, funcion_id, fecha_creacion) VALUES (?, ?, ?)")
    .run(usuario.id, funcion.id, new Date().toISOString());

  for (const asiento of asientos) {
    db.prepare("INSERT INTO reserva_asientos (reserva_id, funcion_id, asiento) VALUES (?, ?, ?)").run(
      resultado.lastInsertRowid, funcion.id, asiento
    );
  }

  const reserva = db.prepare("SELECT * FROM reservas WHERE id = ?").get(resultado.lastInsertRowid);
  return Response.json(reservaAJson(reserva), { status: 201 });
}
