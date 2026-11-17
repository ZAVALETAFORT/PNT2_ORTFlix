"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProtegerRuta } from "@/app/hooks/useProtegerRuta";
import "./favoritos.css";

export default function MisFavoritos() {
  const router = useRouter();
  const autorizado = useProtegerRuta();
  const [usuarioId, setUsuarioId] = useState(null);
  const [token, setToken] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState(null); // id del favorito que se está editando
  const [textoNota, setTextoNota] = useState("");

  useEffect(() => {
    // Mientras useProtegerRuta decide si hay sesión no se pide nada
    if (!autorizado) return;

    async function cargar() {
      try {
        const tokenGuardado = localStorage.getItem("token");

        const meRes = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${tokenGuardado}` },
        });
        // Token vencido o inválido: se vuelve a iniciar sesión
        if (meRes.status === 401) {
          router.push("/login");
          return;
        }
        if (!meRes.ok) throw new Error("No se pudo obtener el usuario.");
        const me = await meRes.json();
        setUsuarioId(me.id);
        setToken(tokenGuardado);

        const res = await fetch(`/api/favoritos/${me.id}`, {
          headers: { Authorization: `Bearer ${tokenGuardado}` },
        });
        if (!res.ok) throw new Error("No se pudieron cargar los favoritos.");
        setFavoritos(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [autorizado, router]);

  async function eliminar(favorito) {
    if (!usuarioId) return;
    try {
      const res = await fetch(`/api/favoritos/${usuarioId}/${favorito.movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFavoritos((prev) => prev.filter((f) => f.id !== favorito.id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "No se pudo eliminar el favorito.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    }
  }

  function empezarEdicion(favorito) {
    setError("");
    setEditandoId(favorito.id);
    setTextoNota(favorito.nota ?? "");
  }

  async function guardarNota(favorito) {
    try {
      const res = await fetch(`/api/favoritos/${usuarioId}/${favorito.movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nota: textoNota.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "No se pudo guardar la nota.");
        return;
      }
      // Se reemplaza solo el favorito editado por la versión que devolvió la API
      setFavoritos((prev) => prev.map((f) => (f.id === favorito.id ? data : f)));
      setEditandoId(null);
    } catch {
      setError("Error de conexión con el servidor.");
    }
  }

  if (!autorizado) return <p className="contenedor">Cargando...</p>;

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
            {favorito.puntaje !== null && (
              <p className="favorito-puntaje">Puntaje: {Number(favorito.puntaje).toFixed(1)}</p>
            )}

            {editandoId === favorito.id ? (
              <>
                <textarea
                  className="favorito-nota-campo"
                  value={textoNota}
                  onChange={(e) => setTextoNota(e.target.value)}
                  rows={3}
                  placeholder="Escribí tu nota..."
                />
                <div className="favorito-acciones">
                  <button className="boton" onClick={() => guardarNota(favorito)}>
                    Guardar
                  </button>
                  <button className="boton boton-secundario" onClick={() => setEditandoId(null)}>
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                {favorito.nota && <p className="favorito-nota">Nota: {favorito.nota}</p>}
                <div className="favorito-acciones">
                  <button className="boton boton-secundario" onClick={() => empezarEdicion(favorito)}>
                    {favorito.nota ? "Editar nota" : "Agregar nota"}
                  </button>
                  <button className="boton boton-peligro" onClick={() => eliminar(favorito)}>
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <p className="favoritos-volver">
        <Link href="/">Volver a cartelera</Link>
      </p>
    </main>
  );
}
