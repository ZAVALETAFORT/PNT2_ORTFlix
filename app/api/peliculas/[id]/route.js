const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Datos de una película de TMDB (el token de TMDB solo existe en el servidor, por eso se pide desde acá)
export async function GET(request, { params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return Response.json({ message: "El id de la película no es válido." }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.TMDB_BASE_URL}/movie/${id}?language=es-AR`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });

    if (res.status === 404) {
      return Response.json({ message: "La película no existe." }, { status: 404 });
    }
    if (!res.ok) throw new Error(`TMDB respondió ${res.status}`);

    const p = await res.json();
    return Response.json({
      id: p.id,
      titulo: p.title,
      sinopsis: p.overview,
      poster: p.poster_path ? `${IMG_URL}${p.poster_path}` : null,
      fechaEstreno: p.release_date,
      puntaje: p.vote_average,
    });
  } catch {
    return Response.json({ message: "No se pudo consultar la película." }, { status: 502 });
  }
}
