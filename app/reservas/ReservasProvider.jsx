"use client";

import { createContext, useContext, useState } from "react";
import { reservas as reservasIniciales, funciones } from "@/src/data/mock";

const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState(reservasIniciales);

  function crearReserva(funcionId, asientos) {
    // Verificar que no haya asientos ocupados
    const ocupados = reservas
      .filter((r) => r.funcionId === funcionId && r.estado === "confirmada")
      .flatMap((r) => r.asientos);

    if (
      asientos.length === 0 ||
      asientos.length > 10 ||
      asientos.some((a) => ocupados.includes(a))
    ) {
      return false;
    }

    const nuevaReserva = {
      id: Math.max(0, ...reservas.map((r) => r.id)) + 1,
      usuarioId: 2, // Cliente de prueba del mock
      funcionId,
      asientos: [...asientos],
      estado: "confirmada",
      fechaCreacion: new Date().toISOString(),
    };

    setReservas([...reservas, nuevaReserva]);
    return true;
  }

  // Cancelar una reserva confirmada
  function cancelarReserva(id) {
    const reserva = reservas.find((r) => r.id === id && r.usuarioId === 2);
    const funcion = funciones.find((f) => f.id === reserva?.funcionId);

    if (!reserva || !funcion || reserva.estado !== "confirmada") {
      return false;
    }

    // No permitir cancelar funciones que ya comenzaron
    const fechaFuncion = new Date(`${funcion.fecha}T${funcion.hora}:00`);

    if (fechaFuncion <= new Date()) {
      return false;
    }

    setReservas((anteriores) =>
      anteriores.map((r) =>
        r.id === id ? { ...r, estado: "cancelada" } : r
      )
    );

    return true;
  }

  return (
    <ReservasContext.Provider value={{ reservas, crearReserva, cancelarReserva }}>
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  return useContext(ReservasContext);
}