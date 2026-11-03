import db from "@/lib/db";
import { error, leerBody, favoritoAJson } from "@/lib/api";

function usuarioExiste(id) {
  return db.prepare("SELECT id FROM usuarios WHERE id = ?").get(Number(id));
}

export async function GET(request, { params }) {
  const { usuarioId } = await params;
  if (!usuarioExiste(usuarioId)) return error(404, "El usuario no existe.");

  const favoritos = db
    .prepare("SELECT * FROM favoritos WHERE usuario_id = ? ORDER BY id")
    .all(Number(usuarioId));
  return Response.json(favoritos.map(favoritoAJson));
}

export async function POST(request, { params }) {
  const { usuarioId } = await params;
  if (!usuarioExiste(usuarioId)) return error(404, "El usuario no existe.");

  const body = await leerBody(request);
  const { movieId, titulo, poster, puntaje, nota } = body;

  if (!movieId || !titulo) {
    return error(400, "Faltan datos del favorito.");
  }

  const existente = db
    .prepare("SELECT id FROM favoritos WHERE usuario_id = ? AND movie_id = ?")
    .get(Number(usuarioId), Number(movieId));
  if (existente) {
    return error(409, "La película ya está en favoritos.");
  }

  const resultado = db
    .prepare(
      "INSERT INTO favoritos (usuario_id, movie_id, titulo, poster, puntaje, nota) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(Number(usuarioId), Number(movieId), String(titulo), poster ?? null, puntaje ?? null, nota ?? null);

  const favorito = db.prepare("SELECT * FROM favoritos WHERE id = ?").get(resultado.lastInsertRowid);
  return Response.json(favoritoAJson(favorito), { status: 201 });
}