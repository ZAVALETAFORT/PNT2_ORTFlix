import Link from "next/link";
import db from "@/lib/db";
import { funcionAJson } from "@/lib/api";

const POSTER_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";
const POSTER_GENERICO = "https://via.placeholder.com/500x750?text=Sin+poster";

function formatearFecha(fecha) {
  if (!fecha) return "Fecha no disponible";
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR");
}

export default async function PeliculaPage({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return (
      <main className="contenedor">
        <p>El id de la película no es válido.</p>
        <Link href="/">Volver a cartelera</Link>
      </main>
    );
  }

  let pelicula = null;
  try {
    const res = await fetch(`${process.env.TMDB_BASE_URL}/movie/${id}?language=es-AR&append_to_response=videos`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const p = await res.json();
      const trailer = (p.videos?.results || []).find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      pelicula = {
        id: p.id,
        titulo: p.title || "Sin título",
        sinopsis: p.overview || "Sin sinopsis",
        poster: p.poster_path ? `${POSTER_URL}${p.poster_path}` : POSTER_GENERICO,
        backdrop: p.backdrop_path ? `${BACKDROP_URL}${p.backdrop_path}` : null,
        fechaEstreno: p.release_date,
        puntaje: p.vote_average,
        duracion: p.runtime,
        generos: (p.genres || []).map((g) => g.name),
        trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      };
    }
  } catch {
    pelicula = null;
  }

  if (!pelicula) {
    return (
      <main className="contenedor">
        <p>No se pudo cargar la película.</p>
        <Link href="/">Volver a cartelera</Link>
      </main>
    );
  }

  const funciones = db
    .prepare("SELECT * FROM funciones WHERE movie_id = ? ORDER BY fecha, hora")
    .all(Number(id))
    .map(funcionAJson);

  return (
    <main className="contenedor">
      {pelicula.backdrop && (
        <div style={{ marginBottom: 16 }}>
          <img
            src={pelicula.backdrop}
            alt={pelicula.titulo}
            style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 8 }}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <img
          src={pelicula.poster}
          alt={pelicula.titulo}
          style={{ width: 220, borderRadius: 8 }}
        />
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>{pelicula.titulo}</h1>
          <p>
            <strong>Estreno:</strong> {formatearFecha(pelicula.fechaEstreno)}
          </p>
          <p>
            <strong>Puntaje:</strong> {pelicula.puntaje ? pelicula.puntaje.toFixed(1) : "-"}
          </p>
          {pelicula.duracion && (
            <p>
              <strong>Duración:</strong> {pelicula.duracion} min
            </p>
          )}
          {pelicula.generos.length > 0 && (
            <p>
              <strong>Géneros:</strong> {pelicula.generos.join(", ")}
            </p>
          )}
          <p>{pelicula.sinopsis}</p>
          {pelicula.trailer && (
            <p>
              <a href={pelicula.trailer} target="_blank" rel="noopener noreferrer">
                Ver tráiler en YouTube
              </a>
            </p>
          )}
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Funciones disponibles</h2>
        {funciones.length === 0 && <p>No hay funciones disponibles para esta película.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {funciones.map((f) => (
            <li key={f.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12, borderRadius: 8 }}>
              <p>
                {f.fecha} - {f.hora} | {f.formato} | {f.idioma}
              </p>
              <p>Sala: {f.salaId} | Precio: ${f.precio}</p>
              <Link href={`/reservas/nueva?funcionId=${f.id}`}>Reservar</Link>
            </li>
          ))}
        </ul>
      </section>

      <p style={{ marginTop: 24 }}>
        <Link href="/">Volver a cartelera</Link>
      </p>
    </main>
  );
}