import db from "@/lib/db";
import { error, leerBody, favoritoAJson } from "@/lib/api";

function buscarFavorito(usuarioId, movieId) {
  return db
    .prepare("SELECT * FROM favoritos WHERE usuario_id = ? AND movie_id = ?")
    .get(Number(usuarioId), Number(movieId));
}

export async function GET(request, { params }) {
  const { usuarioId, movieId } = await params;
  const favorito = buscarFavorito(usuarioId, movieId);
  if (!favorito) return error(404, "El favorito no existe.");
  return Response.json(favoritoAJson(favorito));
}

export async function PUT(request, { params }) {
  const { usuarioId, movieId } = await params;
  const favorito = buscarFavorito(usuarioId, movieId);
  if (!favorito) return error(404, "El favorito no existe.");

  const body = await leerBody(request);
  const { titulo, poster, puntaje, nota } = body;

  const tituloFinal = titulo !== undefined ? String(titulo) : favorito.titulo;
  const posterFinal = poster !== undefined ? poster : favorito.poster;
  const puntajeFinal = puntaje !== undefined ? puntaje : favorito.puntaje;
  const notaFinal = nota !== undefined ? nota : favorito.nota;

  db.prepare(
    "UPDATE favoritos SET titulo = ?, poster = ?, puntaje = ?, nota = ? WHERE id = ?"
  ).run(tituloFinal, posterFinal, puntajeFinal, notaFinal, favorito.id);

  const actualizado = db.prepare("SELECT * FROM favoritos WHERE id = ?").get(favorito.id);
  return Response.json(favoritoAJson(actualizado));
}

export async function DELETE(request, { params }) {
  const { usuarioId, movieId } = await params;
  const favorito = buscarFavorito(usuarioId, movieId);
  if (!favorito) return error(404, "El favorito no existe.");

  db.prepare("DELETE FROM favoritos WHERE id = ?").run(favorito.id);
  return Response.json({ message: "Favorito eliminado." });
}