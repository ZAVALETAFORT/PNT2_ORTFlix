"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { agruparPorDia } from "@/app/components/funcion/fechas";
import "./funciones.css";

// Listado de funciones para todos. El cliente puede reservar; el admin además edita y elimina.
export default function FuncionesPage() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "admin";

  const [funciones, setFunciones] = useState([]);
  const [salas, setSalas] = useState([]);
  const [ahora, setAhora] = useState(null); // momento de la carga, para ocultar funciones que ya empezaron
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [pelicula, setPelicula] = useState(""); // filtro por película (movieId como texto)
  const [dia, setDia] = useState(""); // filtro por día (fecha ISO)
  const [confirmandoId, setConfirmandoId] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const [resFunciones, resSalas] = await Promise.all([
          fetch("/api/funciones", { cache: "no-store" }),
          fetch("/api/salas", { cache: "no-store" }),
        ]);
        if (!resFunciones.ok || !resSalas.ok) throw new Error();
        setFunciones(await resFunciones.json());
        setSalas(await resSalas.json());
        setAhora(Date.now());
      } catch {
        setError("No se pudieron cargar las funciones. Intentá de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  // La API borra solo si la función no tiene reservas confirmadas (si las tiene responde 409)
  async function eliminar(funcion) {
    setAviso("");
    setConfirmandoId(null);
    try {
      const res = await fetch(`/api/funciones/${funcion.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setFunciones((prev) => prev.filter((f) => f.id !== funcion.id));
      } else {
        const data = await res.json().catch(() => ({}));
        setAviso(data.message || "No se pudo eliminar la función.");
      }
    } catch {
      setAviso("Error de conexión con el servidor.");
    }
  }

  const futuras = ahora === null ? [] : funciones.filter((f) => new Date(`${f.fecha}T${f.hora}:00`).getTime() > ahora);

  // Opciones de los filtros: solo películas y días que tienen funciones
  const peliculas = [...new Map(futuras.map((f) => [String(f.movieId), f.titulo])).entries()].sort((a, b) =>
    a[1].localeCompare(b[1])
  );
  const dias = agruparPorDia(futuras).map((g) => ({ fecha: g.fecha, etiqueta: g.etiqueta }));

  const filtradas = futuras.filter(
    (f) => (!pelicula || String(f.movieId) === pelicula) && (!dia || f.fecha === dia)
  );
  const grupos = agruparPorDia(filtradas);

  function nombreSala(salaId) {
    return salas.find((s) => s.id === salaId)?.nombre ?? "-";
  }

  return (
    <main className="contenedor">
      <h1 className="titulo-pagina">Funciones</h1>

      {esAdmin && (
        <p className="funciones-admin">
          <Link href="/admin/funciones/nueva" className="boton">Nueva función</Link>
        </p>
      )}

      <div className="funciones-filtros">
        <label>
          Película
          <select value={pelicula} onChange={(e) => setPelicula(e.target.value)}>
            <option value="">Todas</option>
            {peliculas.map(([id, titulo]) => (
              <option key={id} value={id}>{titulo}</option>
            ))}
          </select>
        </label>
        <label>
          Día
          <select value={dia} onChange={(e) => setDia(e.target.value)}>
            <option value="">Todos</option>
            {dias.map((d) => (
              <option key={d.fecha} value={d.fecha}>{d.etiqueta}</option>
            ))}
          </select>
        </label>
      </div>

      {aviso && <p className="mensaje-error">{aviso}</p>}
      {cargando && <p>Cargando funciones...</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {!cargando && !error && grupos.length === 0 && <p>No hay funciones disponibles.</p>}

      {grupos.map((grupo) => (
        <section key={grupo.fecha} className="funciones-dia">
          <h2>{grupo.etiqueta}</h2>
          <ul>
            {grupo.funciones.map((f) => (
              <li key={f.id} className="funcion-fila">
                <div>
                  <Link href={`/peliculas/${f.movieId}`} className="funcion-titulo">{f.titulo}</Link>
                  <p>
                    <strong>{f.hora}</strong> · {f.formato} · {f.idioma} · {nombreSala(f.salaId)} · $
                    {f.precio.toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="funcion-acciones">
                  <Link href={`/reservas/nueva?funcionId=${f.id}`} className="boton">Reservar</Link>
                  {esAdmin &&
                    (confirmandoId === f.id ? (
                      <>
                        <span>¿Seguro?</span>
                        <button className="boton boton-peligro" onClick={() => eliminar(f)}>Sí</button>
                        <button className="boton boton-secundario" onClick={() => setConfirmandoId(null)}>No</button>
                      </>
                    ) : (
                      <>
                        <Link href={`/admin/funciones/${f.id}/editar`} className="boton boton-secundario">
                          Editar
                        </Link>
                        <button className="boton boton-peligro" onClick={() => setConfirmandoId(f.id)}>
                          Eliminar
                        </button>
                      </>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
