"use client";

import Link from "next/link";
import { useState } from "react";
import { useReservas } from "../ReservasProvider";

export default function CambiarFuncionClient({ reservaId }) {
  const { reservas, funciones, getReservaStatus } = useReservas();
  const [selectedFuncionId, setSelectedFuncionId] = useState(null);

  const reserva = reservas.find((item) => item.id === reservaId);

  if (!reserva || !reserva.funcion) {
    return (
      <main>
        <h1>Cambiar función</h1>
        <p>No encontramos la reserva seleccionada.</p>
        <Link href="/reservas">Volver a mis reservas</Link>
      </main>
    );
  }

  if (getReservaStatus(reserva) !== "confirmada") {
    return (
      <main>
        <h1>Cambiar función</h1>
        <p>Solo podés cambiar reservas confirmadas.</p>
        <Link href="/reservas">Volver a mis reservas</Link>
      </main>
    );
  }

  const funcionesAlternativas = funciones.filter((funcion) => {
    return (
      funcion.pelicula === reserva.funcion.pelicula && funcion.id !== reserva.funcion.id
    );
  });

  return (
    <main>
      <h1>Cambiar función</h1>
      <p>
        <strong>Reserva actual:</strong> {reserva.funcion.pelicula} - {reserva.funcion.fecha} {reserva.funcion.hora}
      </p>
      <p>
        <strong>Asientos actuales:</strong> {reserva.asientos.join(", ")}
      </p>

      {funcionesAlternativas.length === 0 ? (
        <p>No hay otras funciones disponibles para esta película.</p>
      ) : (
        <>
          <p>Elegí una nueva función y luego seleccioná asientos nuevos.</p>
          <ul>
            {funcionesAlternativas.map((funcion) => {
              const isSelected = selectedFuncionId === funcion.id;

              return (
                <li key={funcion.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedFuncionId(funcion.id)}
                    style={{
                      marginBottom: 8,
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                  >
                    {funcion.fecha} {funcion.hora} - {funcion.formato} - {funcion.idioma}
                  </button>
                </li>
              );
            })}
          </ul>

          <Link
            href={
              selectedFuncionId
                ? `/reservas/nueva?funcionId=${selectedFuncionId}&reservaId=${reserva.id}`
                : "#"
            }
            aria-disabled={!selectedFuncionId}
          >
            Continuar con selección de asientos
          </Link>
        </>
      )}

      <p>
        <Link href="/reservas">Volver a mis reservas</Link>
      </p>
    </main>
  );
}
