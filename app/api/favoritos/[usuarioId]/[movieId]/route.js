import db from "@/lib/db";
import { obtenerUsuario } from "@/lib/auth";
import { error, leerBody, favoritoAJson } from "@/lib/api";

function buscarFavorito(usuarioId, movieId) {
  return db
    .prepare("SELECT * FROM favoritos WHERE usuario_id = ? AND movie_id = ?")
    .get(Number(usuarioId), Number(movieId));
}

export async function GET(request, { params }) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  const { usuarioId, movieId } = await params;
  if (usuario.id !== Number(usuarioId)) return error(403, "No tenés permiso para ver estos favoritos.");

  const favorito = buscarFavorito(usuarioId, movieId);
  if (!favorito) return error(404, "El favorito no existe.");
  return Response.json(favoritoAJson(favorito));
}

export async function PUT(request, { params }) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  const { usuarioId, movieId } = await params;
  if (usuario.id !== Number(usuarioId)) return error(403, "No tenés permiso para modificar estos favoritos.");

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
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  const { usuarioId, movieId } = await params;
  if (usuario.id !== Number(usuarioId)) return error(403, "No tenés permiso para modificar estos favoritos.");

  const favorito = buscarFavorito(usuarioId, movieId);
  if (!favorito) return error(404, "El favorito no existe.");

  db.prepare("DELETE FROM favoritos WHERE id = ?").run(favorito.id);
  return Response.json({ message: "Favorito eliminado." });
}