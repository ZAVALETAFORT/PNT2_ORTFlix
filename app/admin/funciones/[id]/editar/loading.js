// Next usa este archivo como pantalla de carga de la ruta. Además hace de <Suspense> para que
// la página pueda usar useParams() al compilar.
export default function Loading() {
  return (
    <main className="contenedor">
      <p>Cargando...</p>
    </main>
  );
}
