"use client";

import Link from "next/link";
import { useState } from "react";
import { useReservas } from "./ReservasProvider";

const STATUS_STYLES = {
  confirmada: { background: "#C8E6C9", color: "#1B5E20" },
  cancelada: { background: "#FFCDD2", color: "#B71C1C" },
  finalizada: { background: "#CFD8DC", color: "#263238" },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ReservasPageClient({ currentTimeIso }) {
  const { reservas, funciones, cancelReserva, getReservaStatus } = useReservas();
  const [confirmingId, setConfirmingId] = useState(null);
  const [error, setError] = useState("");

  const currentTime = currentTimeIso ? new Date(currentTimeIso) : null;

  function onCancel(reservaId) {
    setError("");
    const result = cancelReserva(reservaId);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setConfirmingId(null);
  }

  return (
    <main>
      <h1>Mis reservas</h1>

      <p>
        Crear nueva reserva:{" "}
        {funciones.map((funcion) => (
          <span key={funcion.id} style={{ marginRight: 8 }}>
            <Link href={`/reservas/nueva?funcionId=${funcion.id}`}>
              {funcion.pelicula} ({funcion.fecha} {funcion.hora})
            </Link>
          </span>
        ))}
      </p>

      {error ? <p style={{ color: "#C62828" }}>{error}</p> : null}

      {reservas.length === 0 ? <p>Todavía no tenés reservas</p> : null}

      {reservas.map((reserva) => {
        const status = getReservaStatus(reserva, currentTime);
        const canManage = status === "confirmada";

        return (
          <article key={reserva.id} style={{ border: "1px solid #CFD8DC", marginBottom: 12, padding: 12 }}>
            <h2>{reserva.funcion?.pelicula ?? "Función no disponible"}</h2>
            <p>
              {reserva.funcion?.fecha} {reserva.funcion?.hora} | {reserva.funcion?.formato} |{" "}
              {reserva.funcion?.idioma} | {reserva.sala?.nombre}
            </p>
            <p>
              <strong>Asientos:</strong> {reserva.asientos.join(", ")}
            </p>
            <p>
              <strong>Total:</strong> {formatCurrency(reserva.total)}
            </p>
            <p>
              <span
                style={{
                  ...STATUS_STYLES[status],
                  borderRadius: 4,
                  display: "inline-block",
                  padding: "4px 8px",
                }}
              >
                {status}
              </span>
            </p>

            {!canManage ? null : (
              <div>
                <Link href={`/reservas/cambiar?reservaId=${reserva.id}`}>Cambiar función</Link>{" "}
                {confirmingId === reserva.id ? (
                  <>
                    <p>¿Confirmás la cancelación?</p>
                    <button type="button" onClick={() => onCancel(reserva.id)}>
                      Sí, cancelar
                    </button>{" "}
                    <button type="button" onClick={() => setConfirmingId(null)}>
                      No
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirmingId(reserva.id)}>
                    Cancelar
                  </button>
                )}
              </div>
            )}
          </article>
        );
      })}
    </main>
  );
}
