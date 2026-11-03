"use client";

import { useEffect, useState } from "react";
import { useFunciones } from "./FuncionesContext";
import { proximosDias } from "@/app/components/funcion/fechas";

export default function FuncionesAdminPage() {
  const { funciones, setFunciones, salas, cargando, error } = useFunciones();
  const [dias, setDias] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [confirmandoId, setConfirmandoId] = useState(null); // función que espera el "¿Seguro?"
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const proximos = proximosDias(7);
    setDias(proximos);
    setDiaSeleccionado(proximos[0].iso);
  }, []);

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
    <main className="admin-funciones">
      <h1>Funciones</h1>

      <div className="filtro-dias">
        {dias.map((d) => (
          <button
            key={d.iso}
            className={d.iso === diaSeleccionado ? "dia activo" : "dia"}
            onClick={() => setDiaSeleccionado(d.iso)}
          >
            {d.etiqueta}
          </button>
        ))}
      </div>

      {aviso && <p className="aviso-error">{aviso}</p>}

      {cargando && <p>Cargando funciones...</p>}

      {error && <p className="aviso-error">{error}</p>}

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
                      <button className="btn-peligro" onClick={() => cancelar(f)}>Sí</button>{" "}
                      <button className="btn-secundario" onClick={() => setConfirmandoId(null)}>No</button>
                    </span>
                  ) : (
                    <button className="btn-peligro" onClick={() => setConfirmandoId(f.id)}>
                      Cancelar función
                    </button>
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
