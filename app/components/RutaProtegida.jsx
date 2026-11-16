"use client";

import { useProtegerRuta } from "../hooks/useProtegerRuta";

// Envuelve páginas privadas: muestra su contenido solo si hay sesión (y el rol pedido).
// Uso en un layout: <RutaProtegida rol="admin">{children}</RutaProtegida>
export default function RutaProtegida({ rol, children }) {
  const autorizado = useProtegerRuta(rol);

  if (!autorizado) return <p className="contenedor">Cargando...</p>;
  return children;
}
