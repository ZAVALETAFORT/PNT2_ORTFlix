"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import estilos from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  // La sesión sale del contexto: cuando alguien inicia o cierra sesión, el header se actualiza solo
  const { usuario: user, cerrarSesion } = useAuth();

  function salir() {
    cerrarSesion();
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
            <span>Hola, {user.username}</span>
            <Link href="/reservas" className={estilos.link}>
              Mis reservas
            </Link>
            <Link href="/favoritos" className={estilos.link}>
              Mis favoritos
            </Link>
            {user.rol === "admin" && (
              <Link href="/admin/funciones" className={estilos.link}>
                Administrar funciones
              </Link>
            )}
            <button className={estilos.boton} onClick={salir}>
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
