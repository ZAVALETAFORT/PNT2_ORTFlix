// Trae las películas en cartelera de TMDB (mismo endpoint que usa la cartelera de la app).
// TMDB no tiene horarios: las funciones las arma armarFunciones() de src/data/mock.js con estas películas.
const CANTIDAD_PELICULAS = 8;

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
