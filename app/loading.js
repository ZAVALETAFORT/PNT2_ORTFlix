// Pantalla de carga de la cartelera. Además hace de <Suspense> para que la página
// pueda pedir las películas a TMDB en cada visita.
export default function Loading() {
  return (
    <main className="contenedor">
      <p>Cargando...</p>
    </main>
  );
}
