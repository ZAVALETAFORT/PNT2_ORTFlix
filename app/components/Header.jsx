"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import estilos from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  // Lee la sesión de localStorage. Se vuelve a leer cada vez que cambia la ruta
  // (así el header se actualiza después de iniciar o cerrar sesión).
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [pathname]);

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setUser(null);
    router.push("/login");
  }

  return (
    <header className={estilos.header}>
      <Link href="/" className={estilos.logo}>
        ORTFlix
      </Link>

      <nav className={estilos.nav}>
        {user ? (
          <>
            <span>Hola, {user.name}</span>
            <button className={estilos.boton} onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={estilos.link}>
              Ingresar
            </Link>
            <Link href="/register" className={estilos.link}>
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
