// Arma las funciones de ejemplo con las películas que están hoy en cartelera en TMDB.
// TMDB no tiene horarios: las películas vienen de la API y los días, horas, formatos y precios los generamos acá.
import { enDias } from "../src/data/mock.js";

const CANTIDAD_PELICULAS = 8;

// Películas en cartelera (mismo endpoint que usa la cartelera de la app)
export async function traerPeliculas() {
  if (!process.env.TMDB_TOKEN || !process.env.TMDB_BASE_URL) {
    throw new Error("faltan TMDB_TOKEN o TMDB_BASE_URL en el .env");
  }

  const res = await fetch(`${process.env.TMDB_BASE_URL}/movie/now_playing?language=es-AR&region=AR`, {
    headers: { accept: "application/json", Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`TMDB respondió ${res.status}`);

  const data = await res.json();
  return data.results.slice(0, CANTIDAD_PELICULAS).map((p) => ({ id: p.id, titulo: p.title }));
}

// Horarios de cada día: [sala, hora]. Con 3 por día y 7 días hay 21 lugares, sin superponerse.
const HORARIOS = [[1, "18:00"], [2, "20:30"], [1, "22:00"]];
const FORMATOS = ["2D", "3D", "2D", "4D", "3D"];
const PRECIOS = { "2D": 8000, "3D": 9500, "4D": 12000 };

// Cada película tiene 2 funciones (las 3 primeras tienen 3), en días distintos
export function armarFunciones(peliculas) {
  const orden = [...peliculas, ...peliculas, ...peliculas.slice(0, 3)];

  return orden.map((pelicula, i) => {
    const [salaId, hora] = HORARIOS[i % HORARIOS.length];
    const formato = FORMATOS[i % FORMATOS.length];
    return {
      id: i + 1,
      movieId: pelicula.id,
      titulo: pelicula.titulo,
      salaId,
      fecha: enDias(Math.floor(i / HORARIOS.length) + 1),
      hora,
      formato,
      idioma: i % 2 === 0 ? "Subtitulada" : "Castellano",
      precio: PRECIOS[formato],
    };
  });
}
