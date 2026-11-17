"use client";

import { useProtegerRuta } from "../hooks/useProtegerRuta";

// Muestra sus hijos solo si hay sesión (y el rol, si se pide). Si no, useProtegerRuta redirige al login.
// Uso: <RutaProtegida>...</RutaProtegida>  o  <RutaProtegida rol="admin">...</RutaProtegida>
//
// Los hijos no se sacan de la página, solo se ocultan: si la sesión se cierra con la página abierta
// (por ejemplo al vencer el token), desmontarlos haría fallar a React.
export default function RutaProtegida({ rol, children }) {
  const autorizado = useProtegerRuta(rol);

  return (
    <>
      {!autorizado && <p className="contenedor">Cargando...</p>}
      <div hidden={!autorizado}>{children}</div>
    </>
  );
}
