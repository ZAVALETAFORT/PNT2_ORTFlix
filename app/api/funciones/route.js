import db from "@/lib/db";
import { obtenerUsuario } from "@/lib/auth";
import { error, leerBody, funcionAJson } from "@/lib/api";
import { validarFuncion } from "@/lib/validar";

export async function GET(request) {
  const movieId = new URL(request.url).searchParams.get("movieId");

  let funciones;
  if (movieId) {
    funciones = db
      .prepare("SELECT * FROM funciones WHERE movie_id = ? ORDER BY fecha, hora")
      .all(Number(movieId));
  } else {
    funciones = db.prepare("SELECT * FROM funciones ORDER BY fecha, hora").all();
  }
  return Response.json(funciones.map(funcionAJson));
}

export async function POST(request) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");
  if (usuario.rol !== "admin") return error(403, "Solo un administrador puede crear funciones.");

  const body = await leerBody(request);
  const mensaje = validarFuncion(body);
  if (mensaje) return error(400, mensaje);

  const repetida = db
    .prepare("SELECT id FROM funciones WHERE sala_id = ? AND fecha = ? AND hora = ?")
    .get(body.salaId, body.fecha, body.hora);
  if (repetida) return error(409, "Ya hay una función en esa sala, fecha y hora.");

  const resultado = db
    .prepare(
      "INSERT INTO funciones (movie_id, titulo, sala_id, fecha, hora, formato, idioma, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(body.movieId, body.titulo, body.salaId, body.fecha, body.hora, body.formato, body.idioma, body.precio);

  const funcion = db.prepare("SELECT * FROM funciones WHERE id = ?").get(resultado.lastInsertRowid);
  return Response.json(funcionAJson(funcion), { status: 201 });
}
