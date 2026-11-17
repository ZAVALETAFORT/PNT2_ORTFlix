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

// Íconos chicos dibujados con SVG (toman el color del texto con currentColor)
function IconoPlay() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function IconoEstrella() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" fill="currentColor" />
    </svg>
  );
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
            <div className="detalle-dato">
              <span className="detalle-dato-titulo">Estreno</span>
              <span className="detalle-dato-valor">{formatearFecha(pelicula.fechaEstreno)}</span>
            </div>
            {pelicula.duracion && (
              <div className="detalle-dato">
                <span className="detalle-dato-titulo">Duración</span>
                <span className="detalle-dato-valor">{pelicula.duracion} min</span>
              </div>
            )}
            <div className="detalle-dato">
              <span className="detalle-dato-titulo">Puntaje</span>
              <span className="detalle-dato-valor detalle-puntaje">
                <IconoEstrella /> {pelicula.puntaje ? pelicula.puntaje.toFixed(1) : "-"}
              </span>
            </div>
          </div>

          <p className="detalle-sinopsis">{pelicula.sinopsis}</p>

          {pelicula.trailer && (
            <a
              href={pelicula.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="boton detalle-trailer"
            >
              <IconoPlay /> Ver tráiler
            </a>
          )}
        </div>
      </div>

      <section className="detalle-funciones">
        <h2>Funciones</h2>
        {funciones.length === 0 && (
          <p className="detalle-ayuda">No hay funciones disponibles para esta película.</p>
        )}

        {dias.map((dia) => (
          <div key={dia} className="detalle-dia">
            <h3>{etiquetaDia(dia)}</h3>
            <div className="detalle-horarios">
              {grupos[dia].map((f) => (
                <Link key={f.id} href={`/reservas/nueva?funcionId=${f.id}`} className="detalle-horario">
                  <span className="detalle-hora">{f.hora}</span>
                  <span className="detalle-formato">
                    <span className="detalle-badge">{f.formato}</span> {f.idioma}
                  </span>
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
