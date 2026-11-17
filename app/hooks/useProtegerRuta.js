"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

// Protege una página según la sesión del contexto (AuthProvider).
// Uso: const autorizado = useProtegerRuta();         -> requiere sesión (si no hay, va a /login)
//      const autorizado = useProtegerRuta("admin");  -> requiere rol admin (si no lo es, va al home)
export function useProtegerRuta(rolRequerido) {
  const router = useRouter();
  const { usuario, cargando } = useAuth();

  const autorizado = !cargando && !!usuario && (!rolRequerido || usuario.rol === rolRequerido);

  useEffect(() => {
    if (cargando) return; // todavía se está leyendo la sesión

    if (!usuario) {
      router.push("/login");
    } else if (rolRequerido && usuario.rol !== rolRequerido) {
      router.push("/");
    }
  }, [cargando, usuario, rolRequerido, router]);

  return autorizado;
}
