'use client';

import './PeliculaList.css';
import { useEffect, useState } from 'react';
import PeliculaCard, { IMG_URL } from './PeliculaCard';

export default function PeliculaList() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [favoritos, setFavoritos] = useState([]); // ids de TMDB de las películas favoritas
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    async function cargarPeliculas() {
      try {
        const res = await fetch('/api/peliculas');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setPeliculas(data);
      } catch {
        setError('No se pudo cargar la cartelera. Intentá de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    cargarPeliculas();
  }, []);

  // Si hay sesión, busca el usuario y sus favoritos para marcar los botones
  useEffect(() => {
    async function cargarFavoritos() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const meRes = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) return;
        const me = await meRes.json();
        setUsuarioId(me.id);

        const res = await fetch(`/api/favoritos/${me.id}`);
        if (res.ok) {
          const lista = await res.json();
          setFavoritos(lista.map((f) => f.movieId));
        }
      } catch {
        // sin sesión o sin conexión: la cartelera se ve igual
      }
    }
    cargarFavoritos();
  }, []);

  async function alternarFavorito(movie) {
    setAviso('');
    if (!usuarioId) {
      setAviso('Iniciá sesión para guardar favoritos.');
      return;
    }

    const esFavorita = favoritos.includes(movie.id);
    try {
      let res;
      if (esFavorita) {
        res = await fetch(`/api/favoritos/${usuarioId}/${movie.id}`, { method: 'DELETE' });
      } else {
        res = await fetch(`/api/favoritos/${usuarioId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: movie.id,
            titulo: movie.title,
            poster: movie.poster_path ? `${IMG_URL}${movie.poster_path}` : null,
            puntaje: movie.vote_average ?? null,
          }),
        });
      }

      if (res.ok) {
        setFavoritos((prev) =>
          esFavorita ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
        );
      } else {
        const data = await res.json().catch(() => ({}));
        setAviso(data.message || 'No se pudo actualizar el favorito.');
      }
    } catch {
      setAviso('Error de conexión con el servidor.');
    }
  }

  const filtradas = peliculas.filter((movie) =>
    movie.title.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <div>
      <input
        className="pelicula-list-buscador"
        type="text"
        placeholder="Buscar por título..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {aviso && <p className="pelicula-list-error">{aviso}</p>}

      {loading && <p className="pelicula-list-mensaje">Cargando...</p>}

      {!loading && error && <p className="pelicula-list-error">{error}</p>}

      {!loading && !error && filtradas.length === 0 && (
        <p className="pelicula-list-mensaje">No se encontraron películas</p>
      )}

      {!loading && !error && filtradas.length > 0 && (
        <div className="pelicula-list">
          {filtradas.map((movie) => (
            <PeliculaCard
              key={movie.id}
              movie={movie}
              esFavorita={favoritos.includes(movie.id)}
              onFavorito={alternarFavorito}
            />
          ))}
        </div>
      )}
    </div>
  );
}
