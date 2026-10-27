import './peliculas.css';
import PeliculaList from '@/app/components/pelicula/PeliculaList';

export default function PeliculasPage() {
  return (
    <main className="peliculas">
      <h1 className="peliculas-titulo">ORTFlix - En cartelera</h1>
      <PeliculaList />
    </main>
  );
}