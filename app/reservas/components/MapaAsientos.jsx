"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useReservas } from "../ReservasProvider";

export default function MapaAsientos({ sala, precio, funcionId }) {
  const router = useRouter();
  const { reservas, crearReserva } = useReservas();

  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  //Asientos ocupados de la función actual
  const ocupadosActuales = reservas
    .filter((r) => r.funcionId === funcionId && r.estado === "confirmada")
    .flatMap((r) => r.asientos);

  const filas = Array.from({ length: sala.filas }, (_, i) =>
    String.fromCharCode(65 + i),
  );
  const columnas = Array.from({ length: sala.columnas }, (_, i) => i + 1);

  // Seleccionar o deseleccionar asientos
  function seleccionarAsiento(asiento) {
    if (ocupadosActuales.includes(asiento)) return;

    setMensaje("");

    if (seleccionados.includes(asiento)) {
      setSeleccionados(seleccionados.filter((a) => a !== asiento));
    } else if (seleccionados.length < 10) {
      setSeleccionados([...seleccionados, asiento]);
    }
  }

  // Confirmar la reserva de prueba
  function confirmarReserva() {
    const resultado = crearReserva(funcionId, seleccionados);

    if (!resultado) {
      setMensaje("No se pudo confirmar. Revisá los asientos disponibles.");
      return;
    }

    router.push("/reservas");
  }

  return (
    <div>
      <h2>Seleccioná tus asientos</h2>
      <p style={{ textAlign: "center" }}>PANTALLA</p>

      {filas.map((fila) => (
        <div key={fila} style={{ display: "flex", gap: 5, marginBottom: 5 }}>
          <strong style={{ width: 25 }}>{fila}</strong>

          {columnas.map((columna) => {
            const asiento = `${fila}${columna}`;
            const ocupado = ocupadosActuales.includes(asiento);
            const seleccionado = seleccionados.includes(asiento);

            return (
              <button
                key={asiento}
                type="button"
                disabled={ocupado}
                onClick={() => seleccionarAsiento(asiento)}
                aria-label={`Asiento ${asiento}`}
                aria-pressed={seleccionado}
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: ocupado
                    ? "#888"
                    : seleccionado
                      ? "#2196f3"
                      : "#90ee90",
                  color: "#111",
                  cursor: ocupado ? "not-allowed" : "pointer",
                }}
              >
                {columna}
              </button>
            );
          })}
        </div>
      ))}

      <p>🟩 Libre | 🟦 Seleccionado | ⬛ Ocupado</p>

      <h3>Resumen de la reserva</h3>
      <p>Asientos: {seleccionados.join(", ") || "Ninguno"}</p>
      <p>Cantidad: {seleccionados.length}</p>
      <p>Total: ${precio * seleccionados.length}</p>

      {seleccionados.length === 10 && <p>Máximo de 10 asientos.</p>}

      <button
        type="button"
        disabled={seleccionados.length === 0}
        onClick={confirmarReserva}
        style={{ padding: 10, marginTop: 10 }}
      >
        Confirmar reserva
      </button>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
    </div>
  );
}
