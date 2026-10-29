"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import estilos from "./page.module.css";

// La URL del backend viene de .env.local (NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [formulario, setFormulario] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);

  // Actualiza el campo que se está escribiendo (name, email o password)
  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setExito("");

    // Validar campos obligatorios
    if (
      !formulario.name.trim() ||
      !formulario.email.trim() ||
      !formulario.password
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

       // Validar formato del email
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(formulario.email.trim())) {
      setError("Ingresá un email válido.");
      return;
    }


    // Validar contraseña
    if (formulario.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formulario.name.trim(),
          email: formulario.email.trim(),
          password: formulario.password,
        }),
      });

      // Si el servidor no responde JSON (por ejemplo un 404 en HTML), seguimos con un objeto vacío
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setError("Ese email ya está registrado.");
        } else {
          setError(data.message || "No se pudo crear la cuenta.");
        }
        return;
      }

      setExito("Cuenta creada correctamente. Redirigiendo al login...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error) {
      console.error("Error real del registro:", error);
      setError("Error: " + error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className={estilos.section}>
      <h1>Crear cuenta</h1>

      <form className={estilos.form} onSubmit={handleSubmit} noValidate>
        <label className={estilos.label}>
          Nombre
          <input
            className={estilos.input}
            type="text"
            name="name"
            value={formulario.name}
            onChange={handleChange}
          />
        </label>

        <label className={estilos.label}>
          Email
          <input
            className={estilos.input}
            type="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
          />
        </label>

        <label className={estilos.label}>
          Contraseña
          <input
            className={estilos.input}
            type="password"
            name="password"
            value={formulario.password}
            onChange={handleChange}
          />
        </label>

        <button
          className={estilos.boton}
          type="submit"
          disabled={cargando || exito !== ""}
        >
          {cargando ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      {error && <p className={estilos.error}>{error}</p>}
      {exito && <p className={estilos.success}>{exito}</p>}

      <p className={estilos.footer}>
        ¿Ya tenés cuenta? <Link href="/login">Iniciá sesión</Link>
      </p>
    </section>
  );
}
