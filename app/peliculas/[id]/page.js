import Link from "next/link";
import db from "@/lib/db";
import { funcionAJson } from "@/lib/api";
import "./detalle.css";

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
        <Link href="/">← Volver a la cartelera</Link>
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
        <p>Película no encontrada</p>
        <Link href="/">← Volver a la cartelera</Link>
      </main>
    );
  }

  const funciones = db
    .prepare("SELECT * FROM funciones WHERE movie_id = ? ORDER BY fecha, hora")
    .all(Number(id))
    .map(funcionAJson);

  const grupos = funciones.reduce((acc, f) => {
    if (!acc[f.fecha]) acc[f.fecha] = [];
    acc[f.fecha].push(f);
    return acc;
  }, {});
  const dias = Object.keys(grupos).sort();

  function etiquetaDia(fecha) {
    const d = new Date(`${fecha}T00:00:00`);
    const weekday = d.toLocaleDateString("es-AR", { weekday: "long" });
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${d.getDate()}/${d.getMonth() + 1}`;
  }

  return (
    <main className="contenedor">
      {pelicula.backdrop && (
        <img src={pelicula.backdrop} alt={pelicula.titulo} className="detalle-banner" />
      )}

      <div className="detalle-ficha">
        <img src={pelicula.poster} alt={pelicula.titulo} className="detalle-poster" />

        <div className="detalle-info">
          <h1 className="titulo-pagina">{pelicula.titulo}</h1>

          {pelicula.generos.length > 0 && (
            <div className="detalle-generos">
              {pelicula.generos.map((genero) => (
                <span key={genero} className="detalle-genero">{genero}</span>
              ))}
            </div>
          )}

          <div className="detalle-datos">
            <span>Estreno: {formatearFecha(pelicula.fechaEstreno)}</span>
            {pelicula.duracion && <span>Duración: {pelicula.duracion} min</span>}
            <span className="detalle-puntaje">
              Puntaje: {pelicula.puntaje ? pelicula.puntaje.toFixed(1) : "-"}
            </span>
          </div>

          <p className="detalle-sinopsis">{pelicula.sinopsis}</p>

          {pelicula.trailer && (
            <a
              href={pelicula.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton-secundario detalle-trailer"
            >
              Ver tráiler en YouTube
            </a>
          )}
        </div>
      </div>

      <section className="detalle-funciones">
        <h2>Funciones disponibles</h2>
        {funciones.length === 0 ? (
          <p className="detalle-ayuda">No hay funciones disponibles para esta película.</p>
        ) : (
          <p className="detalle-ayuda">Elegí un horario para reservar tus asientos.</p>
        )}

        {dias.map((dia) => (
          <div key={dia} className="detalle-dia">
            <h3>{etiquetaDia(dia)}</h3>
            <div className="detalle-horarios">
              {grupos[dia].map((f) => (
                <Link key={f.id} href={`/reservas/nueva?funcionId=${f.id}`} className="detalle-horario">
                  <span className="detalle-hora">{f.hora}</span>
                  <span className="detalle-formato">{f.formato} · {f.idioma}</span>
                  <span className="detalle-precio">${f.precio.toLocaleString("es-AR")}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="detalle-volver">
        <Link href="/">← Volver a la cartelera</Link>
      </p>
    </main>
  );
}
