import db from "@/lib/db";
import { obtenerUsuario } from "@/lib/auth";
import { error, leerBody, reservaAJson, asientosOcupados } from "@/lib/api";
import { validarAsientos } from "@/lib/validar";

export async function PUT(request, { params }) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  const { id } = await params;
  const reserva = db.prepare("SELECT * FROM reservas WHERE id = ?").get(Number(id));
  if (!reserva) return error(404, "La reserva no existe.");
  if (reserva.usuario_id !== usuario.id) return error(403, "Esa reserva no es tuya.");
  if (reserva.estado === "cancelada") return error(409, "La reserva ya está cancelada.");

  const body = await leerBody(request);

  // Cancelar: se borran sus asientos para que queden libres
  if (body.estado === "cancelada") {
    db.prepare("DELETE FROM reserva_asientos WHERE reserva_id = ?").run(reserva.id);
    db.prepare("UPDATE reservas SET estado = 'cancelada' WHERE id = ?").run(reserva.id);
    return Response.json(reservaAJson({ ...reserva, estado: "cancelada" }));
  }

  // Cambiar de función: { funcionId, asientos }
  if (!body.funcionId || !body.asientos) {
    return error(400, 'Enviá { estado: "cancelada" } o { funcionId, asientos }.');
  }

  const funcion = db.prepare("SELECT * FROM funciones WHERE id = ?").get(body.funcionId);
  if (!funcion) return error(404, "La función no existe.");

  const sala = db.prepare("SELECT * FROM salas WHERE id = ?").get(funcion.sala_id);
  const mensaje = validarAsientos(body.asientos, sala);
  if (mensaje) return error(400, mensaje);

  // Los asientos de esta misma reserva no cuentan como ocupados
  const ocupados = asientosOcupados(funcion.id, reserva.id);
  if (body.asientos.some((a) => ocupados.includes(a))) {
    return error(409, "Alguno de los asientos ya está ocupado.");
  }

  db.prepare("DELETE FROM reserva_asientos WHERE reserva_id = ?").run(reserva.id);
  for (const asiento of body.asientos) {
    db.prepare("INSERT INTO reserva_asientos (reserva_id, funcion_id, asiento) VALUES (?, ?, ?)").run(
      reserva.id, funcion.id, asiento
    );
  }
  db.prepare("UPDATE reservas SET funcion_id = ? WHERE id = ?").run(funcion.id, reserva.id);

  const actualizada = db.prepare("SELECT * FROM reservas WHERE id = ?").get(reserva.id);
  return Response.json(reservaAJson(actualizada));
}
