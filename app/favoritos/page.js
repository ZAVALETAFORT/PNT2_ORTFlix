"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./favoritos.css";

export default function MisFavoritos() {
  const [usuarioId, setUsuarioId] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function cargar() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Necesitás iniciar sesión.");

        const meRes = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("Necesitás iniciar sesión.");
        const me = await meRes.json();
        setUsuarioId(me.id);

        const res = await fetch(`/api/favoritos/${me.id}`);
        if (!res.ok) throw new Error("No se pudieron cargar los favoritos.");
        setFavoritos(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  async function eliminar(favorito) {
    if (!usuarioId) return;
    try {
      const res = await fetch(`/api/favoritos/${usuarioId}/${favorito.movieId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFavoritos((prev) => prev.filter((f) => f.id !== favorito.id));
      } else {
        const data = await res.json();
        setError(data.message || "No se pudo eliminar el favorito.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    }
  }

  return (
    <main className="contenedor">
      <h1 className="titulo-pagina">Mis favoritos</h1>

      {cargando && <p>Cargando favoritos...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && favoritos.length === 0 && !error && (
        <p>Todavía no tenés favoritos.</p>
      )}

      <ul className="favoritos-lista">
        {favoritos.map((favorito) => (
          <li key={favorito.id} className="favorito">
            <h2>{favorito.titulo}</h2>
            {favorito.poster && <img src={favorito.poster} alt={favorito.titulo} />}
            {favorito.puntaje !== null && <p className="favorito-puntaje">Puntaje: {favorito.puntaje}</p>}
            {favorito.nota && <p className="favorito-nota">Nota: {favorito.nota}</p>}
            <button className="boton boton-peligro" onClick={() => eliminar(favorito)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p className="favoritos-volver">
        <Link href="/">Volver a cartelera</Link>
      </p>
    </main>
  );
}