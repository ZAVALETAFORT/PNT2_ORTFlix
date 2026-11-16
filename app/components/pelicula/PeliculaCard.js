import Link from 'next/link';
import './PeliculaCard.css';


export const IMG_URL = 'https://image.tmdb.org/t/p/w500';

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-AR');
}

// El botón de favorito aparece solo si la lista le pasa onFavorito
export default function PeliculaCard({ movie, esFavorita = false, onFavorito }) {
  return (
    <div className="movie-card">
      {/* El póster y el título llevan al detalle de la película (#9) */}
      <Link href={`/peliculas/${movie.id}`} className="movie-card-link">
        {movie.poster_path ? (
          <img src={`${IMG_URL}${movie.poster_path}`} alt={movie.title} className="movie-card-poster" />
        ) : (
          <div className="movie-card-sin-poster">Sin imagen</div>
        )}
      </Link>
      <div className="movie-card-info">
        <h3 className="movie-card-titulo" title={movie.title}>
          <Link href={`/peliculas/${movie.id}`} className="movie-card-link">{movie.title}</Link>
        </h3>
        <p className="movie-card-fecha">Estreno: {formatearFecha(movie.release_date)}</p>
        <p className="movie-card-rating">Puntaje: {movie.vote_average?.toFixed(1) ?? '-'}</p>
        {/* <p className="movie-card-descripcion">{movie.overview || 'Sin descripción disponible.'}</p> */}
        {onFavorito && (
          <button
            type="button"
            className={`movie-card-favorito${esFavorita ? ' activo' : ''}`}
            aria-pressed={esFavorita}
            onClick={() => onFavorito(movie)}
          >
            {esFavorita ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
        )}
      </div>
    </div>
  );
}
