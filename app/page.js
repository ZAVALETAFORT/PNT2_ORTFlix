import PeliculaList from '@/app/components/pelicula/PeliculaList';

const BASE_URL = process.env.TMDB_BASE_URL;

async function getPeliculas(path) {
  'use cache';
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const data = await res.json();
  return data.results;
}

export default async function Home() {
  let peliculas = [];
  let error = null;

  try {
    peliculas = await getPeliculas('/movie/now_playing?language=es-AR&region=AR');
  } catch (e) {
    error = `${e.message} - ${e.cause?.code ?? e.cause?.message ?? ''}`;
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>ORTFlix - En cartelera</h1>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <PeliculaList peliculas={peliculas} />}
    </main>
  );
}