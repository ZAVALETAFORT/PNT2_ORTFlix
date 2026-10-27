"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSalaById } from "../../mock";
import { useReservas } from "../ReservasProvider";

const COLORS = {
  libre: "#E8F5E9",
  seleccionado: "#1976D2",
  ocupado: "#FFCDD2",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ReservaNuevaClient({ funcionId, reservaId }) {
  const router = useRouter();
  const { funciones, reservas, getOccupiedSeats, createReserva } = useReservas();

  const funcion = funciones.find((item) => item.id === funcionId);
  const sala = funcion ? getSalaById(funcion.salaId) : null;
  const reservaOriginal = reservaId
    ? reservas.find((reserva) => reserva.id === reservaId)
    : null;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const occupiedSeats = useMemo(() => {
    return getOccupiedSeats(funcionId, { excludeReservaId: reservaId });
  }, [funcionId, getOccupiedSeats, reservaId]);

  if (!funcion || !sala) {
    return (
      <main>
        <h1>Nueva reserva</h1>
        <p>No encontramos la función indicada.</p>
        <Link href="/reservas">Volver a mis reservas</Link>
      </main>
    );
  }

  const rowLabels = Array.from({ length: sala.filas }, (_, index) => {
    return String.fromCharCode(65 + index);
  });

  const columnLabels = Array.from({ length: sala.columnas }, (_, index) => index + 1);

  function toggleSeat(seatCode) {
    if (occupiedSeats.includes(seatCode)) {
      return;
    }

    setError("");
    setSelectedSeats((current) => {
      if (current.includes(seatCode)) {
        return current.filter((seat) => seat !== seatCode);
      }

      if (current.length >= 10) {
        setError("Solo podés elegir hasta 10 asientos por reserva.");
        return current;
      }

      return [...current, seatCode];
    });
  }

  function getSeatState(seatCode) {
    if (occupiedSeats.includes(seatCode)) {
      return "ocupado";
    }

    if (selectedSeats.includes(seatCode)) {
      return "seleccionado";
    }

    return "libre";
  }

  function handleConfirm() {
    setSubmitting(true);
    setError("");

    const result = createReserva({
      funcionId,
      asientos: selectedSeats,
      reservaIdToReplace: reservaId,
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      setSelectedSeats((current) => {
        return current.filter((seat) => !occupiedSeats.includes(seat));
      });
      return;
    }

    router.push("/reservas");
  }

  return (
    <main>
      <h1>{reservaOriginal ? "Cambiar asientos" : "Nueva reserva"}</h1>

      <p>
        <strong>Película:</strong> {funcion.pelicula} | <strong>Día:</strong> {funcion.fecha} |{" "}
        <strong>Horario:</strong> {funcion.hora} | <strong>Formato:</strong> {funcion.formato} |{" "}
        <strong>Idioma:</strong> {funcion.idioma} | <strong>Sala:</strong> {sala.nombre}
      </p>

      <section style={{ marginBottom: 20 }}>
        <p
          style={{
            textAlign: "center",
            padding: 8,
            background: "#ECEFF1",
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          Pantalla
        </p>

        <div style={{ display: "grid", gap: 8 }}>
          {rowLabels.map((rowLabel) => (
            <div key={rowLabel} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <strong style={{ width: 20 }}>{rowLabel}</strong>
              {columnLabels.map((column) => {
                const seatCode = `${rowLabel}${column}`;
                const seatState = getSeatState(seatCode);
                const isDisabled = seatState === "ocupado";

                return (
                  <button
                    key={seatCode}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => toggleSeat(seatCode)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      border: "1px solid #B0BEC5",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      background: COLORS[seatState],
                      color: seatState === "seleccionado" ? "#FFF" : "#000",
                    }}
                    aria-label={`Asiento ${seatCode}`}
                  >
                    {column}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ background: COLORS.libre, padding: "4px 8px", borderRadius: 4 }}>
          Libre
        </span>
        <span style={{ background: COLORS.seleccionado, color: "#FFF", padding: "4px 8px", borderRadius: 4 }}>
          Seleccionado
        </span>
        <span style={{ background: COLORS.ocupado, padding: "4px 8px", borderRadius: 4 }}>
          Ocupado
        </span>
      </div>

      <section style={{ marginBottom: 16 }}>
        <h2>Resumen</h2>
        <p>
          <strong>Asientos:</strong> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
        </p>
        <p>
          <strong>Cantidad:</strong> {selectedSeats.length}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(selectedSeats.length * funcion.precio)}
        </p>
      </section>

      {error ? <p style={{ color: "#C62828" }}>{error}</p> : null}

      <button
        type="button"
        disabled={selectedSeats.length === 0 || submitting}
        onClick={handleConfirm}
      >
        Confirmar reserva
      </button>{" "}
      <Link href="/reservas">Volver</Link>
    </main>
  );
}
