// La página depende del id de la URL y de las funciones de la base: se arma en cada pedido
export const instant = false;

import Link from "next/link";
import { connection } from "next/server";
import db from "@/lib/db";
import { funcionAJson } from "@/lib/api";
import { agruparPorDia } from "@/app/components/funcion/fechas";
import "./detalle.css";

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const FONDO_URL = "https://image.tmdb.org/t/p/w1280";

// Ficha de TMDB con los videos (para el tráiler). Devuelve null si la película no existe.
async function buscarPelicula(id) {
  const res = await fetch(
    `${process.env.TMDB_BASE_URL}/movie/${id}?language=es-AR&append_to_response=videos&include_video_language=es,en`,
    {
      headers: { accept: "application/json", Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB respondió ${res.status}`);
  return res.json();
}

// Funciones de la película que todavía no empezaron, con el nombre de la sala
function funcionesFuturas(movieId) {
  const ahora = new Date();
  const salas = db.prepare("SELECT id, nombre FROM salas").all();
  return db
    .prepare("SELECT * FROM funciones WHERE movie_id = ?")
    .all(movieId)
    .map(funcionAJson)
    .filter((f) => new Date(`${f.fecha}T${f.hora}:00`) > ahora)
    .map((f) => ({ ...f, sala: salas.find((s) => s.id === f.salaId)?.nombre ?? "-" }));
}

function volver() {
  return (
    <p className="detalle-volver">
      <Link href="/">← Volver a la cartelera</Link>
    </p>
  );
}

export default async function DetallePelicula({ params }) {
  await connection();
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return (
      <main className="contenedor">
        <h1 className="titulo-pagina">Película no encontrada</h1>
        {volver()}
      </main>
    );
  }

  let pelicula;
  try {
    pelicula = await buscarPelicula(id);
  } catch {
    return (
      <main className="contenedor">
        <p className="mensaje-error">No se pudo consultar la película. Intentá de nuevo más tarde.</p>
        {volver()}
      </main>
    );
  }

  if (!pelicula) {
    return (
      <main className="contenedor">
        <h1 className="titulo-pagina">Película no encontrada</h1>
        {volver()}
      </main>
    );
  }

  const trailer = pelicula.videos?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const dias = agruparPorDia(funcionesFuturas(Number(id)));
  const fondo = pelicula.backdrop_path ? `url(${FONDO_URL}${pelicula.backdrop_path})` : "none";

  return (
    <main>
      <section className="detalle-cabecera" style={{ backgroundImage: fondo }}>
        <div className="detalle-cabecera-contenido contenedor">
          {pelicula.poster_path ? (
            <img className="detalle-poster" src={`${IMG_URL}${pelicula.poster_path}`} alt={pelicula.title} />
          ) : (
            <div className="detalle-poster detalle-sin-poster">Sin imagen</div>
          )}

          <div className="detalle-info">
            <h1>{pelicula.title}</h1>
            <p className="detalle-datos">
              {pelicula.release_date
                ? `Estreno: ${new Date(`${pelicula.release_date}T00:00:00`).toLocaleDateString("es-AR")}`
                : "Fecha de estreno no disponible"}
              {pelicula.runtime ? ` · ${pelicula.runtime} min` : ""}
              {` · Puntaje: ${pelicula.vote_average ? pelicula.vote_average.toFixed(1) : "-"}`}
            </p>
            {pelicula.genres?.length > 0 && (
              <p className="detalle-generos">
                {pelicula.genres.map((g) => (
                  <span key={g.id} className="detalle-genero">{g.name}</span>
                ))}
              </p>
            )}
            <p className="detalle-sinopsis">{pelicula.overview || "Sin sinopsis."}</p>
            {trailer && (
              <a
                className="boton"
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver tráiler
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="contenedor">
        <h2 className="detalle-subtitulo">Funciones disponibles</h2>

        {dias.length === 0 && <p>No hay funciones disponibles para esta película.</p>}

        {dias.map((dia) => (
          <div key={dia.fecha} className="detalle-dia">
            <h3>{dia.etiqueta}</h3>
            <div className="detalle-horarios">
              {dia.funciones.map((f) => (
                <Link key={f.id} href={`/reservas/nueva?funcionId=${f.id}`} className="detalle-horario">
                  <strong>{f.hora}</strong> · {f.formato} · {f.idioma}
                  <span>{f.sala} · ${f.precio.toLocaleString("es-AR")}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {volver()}
      </section>
    </main>
  );
}
