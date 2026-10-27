'use client';

import './PeliculaList.css';
import { useEffect, useState } from 'react';
import PeliculaCard from './PeliculaCard';

export default function PeliculaList() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

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

      {loading && <p className="pelicula-list-mensaje">Cargando...</p>}

      {!loading && error && <p className="pelicula-list-error">{error}</p>}

      {!loading && !error && filtradas.length === 0 && (
        <p className="pelicula-list-mensaje">No se encontraron películas</p>
      )}

      {!loading && !error && filtradas.length > 0 && (
        <div className="pelicula-list">
          {filtradas.map((movie) => (
            <PeliculaCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}