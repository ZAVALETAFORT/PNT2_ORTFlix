"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Protege una página según la sesión guardada en localStorage.
// Uso: const autorizado = useProtegerRuta();         -> requiere sesión (si no hay, va a /login)
//      const autorizado = useProtegerRuta("admin");  -> requiere rol admin (si no lo es, va al home)
export function useProtegerRuta(rolRequerido) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/login");
    } else if (rolRequerido && user.rol !== rolRequerido) {
      router.push("/");
    } else {
      // localStorage solo existe en el navegador: hay que leerlo en un efecto
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAutorizado(true);
    }
  }, [router, rolRequerido]);

  return autorizado;
}
