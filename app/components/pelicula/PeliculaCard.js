import './PeliculaCard.css';


const IMG_URL = 'https://image.tmdb.org/t/p/w500';

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-AR');
}

export default function PeliculaCard({ movie }) {
  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img src={`${IMG_URL}${movie.poster_path}`} alt={movie.title} className="movie-card-poster" />
      ) : (
        <div className="movie-card-sin-poster">Sin imagen</div>
      )}
      <div className="movie-card-info">
        <h3 className="movie-card-titulo" title={movie.title}>{movie.title}</h3>
        <p className="movie-card-fecha">Estreno: {formatearFecha(movie.release_date)}</p>
        <p className="movie-card-rating">Puntaje: {movie.vote_average?.toFixed(1) ?? '-'}</p>
        {/* <p className="movie-card-descripcion">{movie.overview || 'Sin descripción disponible.'}</p> */}
      </div>
    </div>
  );
}