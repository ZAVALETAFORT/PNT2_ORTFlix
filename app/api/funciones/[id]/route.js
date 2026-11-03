import { connection } from "next/server";
import db from "@/lib/db";
import { obtenerUsuario } from "@/lib/auth";
import { error, leerBody, funcionAJson } from "@/lib/api";
import { validarFuncion } from "@/lib/validar";

function buscarFuncion(id) {
  return db.prepare("SELECT * FROM funciones WHERE id = ?").get(Number(id));
}

function contarReservasConfirmadas(funcionId) {
  return db
    .prepare("SELECT COUNT(*) AS total FROM reservas WHERE funcion_id = ? AND estado = 'confirmada'")
    .get(funcionId).total;
}

export async function GET(request, { params }) {
  await connection();
  const { id } = await params;

  const funcion = buscarFuncion(id);
  if (!funcion) return error(404, "La función no existe.");
  return Response.json(funcionAJson(funcion));
}

export async function PUT(request, { params }) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");
  if (usuario.rol !== "admin") return error(403, "Solo un administrador puede modificar funciones.");

  const { id } = await params;
  const funcion = buscarFuncion(id);
  if (!funcion) return error(404, "La función no existe.");

  const body = await leerBody(request);
  const mensaje = validarFuncion(body);
  if (mensaje) return error(400, mensaje);

  // Otra función en la misma sala, fecha y hora
  const repetida = db
    .prepare("SELECT id FROM funciones WHERE sala_id = ? AND fecha = ? AND hora = ? AND id <> ?")
    .get(body.salaId, body.fecha, body.hora, funcion.id);
  if (repetida) return error(409, "Ya hay una función en esa sala, fecha y hora.");

  // Los asientos reservados dependen de la sala: no se puede cambiarla si hay reservas
  if (body.salaId !== funcion.sala_id && contarReservasConfirmadas(funcion.id) > 0) {
    return error(409, "No se puede cambiar la sala: la función tiene reservas confirmadas.");
  }

  db.prepare(
    "UPDATE funciones SET movie_id = ?, titulo = ?, sala_id = ?, fecha = ?, hora = ?, formato = ?, idioma = ?, precio = ? WHERE id = ?"
  ).run(body.movieId, body.titulo, body.salaId, body.fecha, body.hora, body.formato, body.idioma, body.precio, funcion.id);

  return Response.json(funcionAJson(buscarFuncion(funcion.id)));
}

export async function DELETE(request, { params }) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");
  if (usuario.rol !== "admin") return error(403, "Solo un administrador puede borrar funciones.");

  const { id } = await params;
  const funcion = buscarFuncion(id);
  if (!funcion) return error(404, "La función no existe.");

  if (contarReservasConfirmadas(funcion.id) > 0) {
    return error(409, "No se puede borrar: la función tiene reservas confirmadas.");
  }

  // Las reservas canceladas ya no tienen asientos; se borran para poder borrar la función
  db.prepare("DELETE FROM reservas WHERE funcion_id = ?").run(funcion.id);
  db.prepare("DELETE FROM funciones WHERE id = ?").run(funcion.id);

  return Response.json({ message: "Función eliminada." });
}
