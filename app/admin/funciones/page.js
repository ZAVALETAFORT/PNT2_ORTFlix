"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useFunciones } from "./FuncionesContext";
import { hoyISO, proximosDias } from "@/app/components/funcion/fechas";

function suscribirseSinCambios() {
  return () => {};
}

export default function FuncionesAdminPage() {
  const { funciones, setFunciones, salas, cargando, error } = useFunciones();
  const hoy = useSyncExternalStore(suscribirseSinCambios, hoyISO, () => "");
  const [elegido, setElegido] = useState("");
  const [confirmandoId, setConfirmandoId] = useState(null); // función que espera el "¿Seguro?"
  const [aviso, setAviso] = useState("");

  const dias = hoy ? proximosDias(7) : [];
  const diaSeleccionado = elegido || hoy; // hasta que se toque un botón, se muestra hoy

  const delDia = funciones
    .filter((f) => f.fecha === diaSeleccionado)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  function nombreSala(salaId) {
    return salas.find((s) => s.id === salaId)?.nombre ?? "-";
  }

  // La API borra la función solo si no tiene reservas confirmadas (si las tiene responde 409)
  async function cancelar(funcion) {
    setAviso("");
    setConfirmandoId(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setAviso("Iniciá sesión como administrador para cancelar funciones.");
      return;
    }

    try {
      const res = await fetch(`/api/funciones/${funcion.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFunciones((prev) => prev.filter((f) => f.id !== funcion.id));
      } else {
        const data = await res.json().catch(() => ({}));
        setAviso(data.message || "No se pudo cancelar la función.");
      }
    } catch {
      setAviso("Error de conexión con el servidor.");
    }
  }

  if (dias.length === 0) return null;

  return (
    <main className="contenedor">
      <h1 className="titulo-pagina">Funciones</h1>

      <Link href="/admin/funciones/nueva" className="boton">
        Nueva función
      </Link>

      <div className="filtro-dias">
        {dias.map((d) => (
          <button
            key={d.iso}
            className={d.iso === diaSeleccionado ? "dia activo" : "dia"}
            onClick={() => setElegido(d.iso)}
          >
            {d.etiqueta}
          </button>
        ))}
      </div>

      {aviso && <p className="mensaje-error">{aviso}</p>}

      {cargando && <p>Cargando funciones...</p>}

      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && delDia.length === 0 && <p>No hay funciones para este día</p>}

      {!cargando && !error && delDia.length > 0 && (
        <table className="tabla-funciones">
          <thead>
            <tr>
              <th>Película</th>
              <th>Sala</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Formato</th>
              <th>Idioma</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {delDia.map((f) => (
              <tr key={f.id}>
                <td>{f.titulo}</td>
                <td>{nombreSala(f.salaId)}</td>
                <td>{f.fecha}</td>
                <td>{f.hora}</td>
                <td><span className="etiqueta">{f.formato}</span></td>
                <td><span className="etiqueta">{f.idioma}</span></td>
                <td>${f.precio.toLocaleString("es-AR")}</td>
                <td>
                  {confirmandoId === f.id ? (
                    <span>
                      ¿Seguro?{" "}
                      <button className="boton boton-peligro" onClick={() => cancelar(f)}>Sí</button>{" "}
                      <button className="boton boton-secundario" onClick={() => setConfirmandoId(null)}>No</button>
                    </span>
                  ) : (
                    <span className="acciones-fila">
                      <Link href={`/admin/funciones/${f.id}/editar`} className="boton boton-secundario">
                        Editar
                      </Link>
                      <button className="boton boton-peligro" onClick={() => setConfirmandoId(f.id)}>
                        Eliminar
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
