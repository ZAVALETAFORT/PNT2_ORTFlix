"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import estilos from "./page.module.css";

// La URL del backend viene de .env.local (NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completá el email y la contraseña.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email o contraseña incorrectos.");
        return;
      }

      // El login del profesor no trae el rol: se lo pedimos a nuestra API con el token
      const responseMe = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (!responseMe.ok) {
        setError("No se pudo obtener el rol del usuario.");
        return;
      }

      const usuario = await responseMe.json();

      // Se guarda la sesión con las claves del contrato (README), agregando el rol
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ ...data.user, rol: usuario.rol }));
      localStorage.setItem("userEmail", data.user.email);

      router.push("/");
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className={estilos.section}>
      <h1>Iniciar sesión</h1>

      <form className={estilos.form} onSubmit={handleSubmit}>
        <label className={estilos.label}>
          Email
          <input
            className={estilos.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={estilos.label}>
          Contraseña
          <input
            className={estilos.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className={estilos.boton} type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {error && <p className={estilos.error}>{error}</p>}

      <p className={estilos.footer}>
        ¿No tenés cuenta? <Link href="/register">Registrate</Link>
      </p>
    </section>
  );
}
