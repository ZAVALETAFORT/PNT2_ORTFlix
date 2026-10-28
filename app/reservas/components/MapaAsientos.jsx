"use client";

import { useState } from "react";

export default function MapaAsientos({ sala, ocupados, precio }) {
  const [seleccionados, setSeleccionados] = useState([]);

  // Generar las filas y columnas según la sala
  const filas = Array.from({ length: sala.filas }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const columnas = Array.from({ length: sala.columnas }, (_, i) => i + 1);

  // Seleccionar o deseleccionar un asiento
  function seleccionarAsiento(asiento) {
    if (ocupados.includes(asiento)) return;

    if (seleccionados.includes(asiento)) {
      setSeleccionados(seleccionados.filter((a) => a !== asiento));
    } else if (seleccionados.length < 10) {
      setSeleccionados([...seleccionados, asiento]);
    }
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
            const ocupado = ocupados.includes(asiento);
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
    </div>
  );
}
