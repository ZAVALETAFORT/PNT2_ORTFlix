import { NextResponse } from 'next/server';

async function getEnCartelera() {
  'use cache';
  const res = await fetch(`${process.env.TMDB_BASE_URL}/movie/now_playing?language=es-AR&region=AR`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  const data = await res.json();
  return data.results;
}

export async function GET() {
  try {
    const peliculas = await getEnCartelera();
    return NextResponse.json(peliculas);
    } catch (e) {
        return NextResponse.json({ error: `${e.message} - ${e.cause?.code ?? ''}` }, { status: 502 });
    }
}