
"use client";

import { createContext, useContext, useState } from "react";
import { reservas as reservasIniciales } from "@/src/data/mock";

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

  return (
    <ReservasContext.Provider value={{ reservas, crearReserva }}>
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  return useContext(ReservasContext);
}