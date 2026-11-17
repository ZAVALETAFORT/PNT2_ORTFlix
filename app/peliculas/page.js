import PeliculaList from '@/app/components/pelicula/PeliculaList';

export default function PeliculasPage() {
  return (
    <main className="contenedor">
      <h1 className="titulo-pagina">ORTFlix - En cartelera</h1>
      <PeliculaList />
    </main>
  );
}