"use client";

import { createContext, useContext, useState } from "react";
import {
  funciones,
  getFechaHoraFuncion,
  getFuncionById,
  getSalaById,
  reservasMock,
} from "../mock";

const ReservasContext = createContext(null);

function normalizeId(id) {
  const parsed = Number.parseInt(id, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState(reservasMock);

  function getReservaStatus(reserva, currentTime = null) {
    if (reserva.estado === "cancelada") {
      return "cancelada";
    }

    const funcion = getFuncionById(reserva.funcionId);

    if (!funcion) {
      return "cancelada";
    }

    if (currentTime && getFechaHoraFuncion(funcion) <= currentTime) {
      return "finalizada";
    }

    return "confirmada";
  }

  function getOccupiedSeats(funcionId, options = {}) {
    const normalizedFuncionId = normalizeId(funcionId);
    const excludeReservaId = normalizeId(options.excludeReservaId);

    if (normalizedFuncionId === null) {
      return [];
    }

    const occupiedSet = new Set();

    reservas
      .filter((reserva) => {
        if (normalizeId(reserva.funcionId) !== normalizedFuncionId) {
          return false;
        }

        if (excludeReservaId !== null && reserva.id === excludeReservaId) {
          return false;
        }

        return reserva.estado === "confirmada";
      })
      .forEach((reserva) => {
        reserva.asientos.forEach((asiento) => occupiedSet.add(asiento));
      });

    return Array.from(occupiedSet);
  }

  function createReserva({ funcionId, asientos, reservaIdToReplace }) {
    const normalizedFuncionId = normalizeId(funcionId);
    const normalizedReservaIdToReplace = normalizeId(reservaIdToReplace);
    const uniqueAsientos = Array.from(new Set(asientos));

    if (normalizedFuncionId === null) {
      return { ok: false, error: "Función inválida." };
    }

    if (uniqueAsientos.length === 0) {
      return { ok: false, error: "Elegí al menos un asiento." };
    }

    if (uniqueAsientos.length > 10) {
      return { ok: false, error: "El máximo por reserva es de 10 asientos." };
    }

    let result = { ok: false, error: "No se pudo crear la reserva." };

    setReservas((prevReservas) => {
      const funcion = getFuncionById(normalizedFuncionId);

      if (!funcion) {
        result = { ok: false, error: "La función no existe." };
        return prevReservas;
      }

      const occupiedSet = new Set();

      prevReservas
        .filter((reserva) => {
          if (normalizeId(reserva.funcionId) !== normalizedFuncionId) {
            return false;
          }

          if (
            normalizedReservaIdToReplace !== null &&
            reserva.id === normalizedReservaIdToReplace
          ) {
            return false;
          }

          return reserva.estado === "confirmada";
        })
        .forEach((reserva) => {
          reserva.asientos.forEach((asiento) => occupiedSet.add(asiento));
        });

      const newlyOccupied = uniqueAsientos.filter((asiento) => occupiedSet.has(asiento));

      if (newlyOccupied.length > 0) {
        result = {
          ok: false,
          error: `Los asientos ${newlyOccupied.join(", ")} ya no están disponibles.`,
        };
        return prevReservas;
      }

      if (normalizedReservaIdToReplace !== null) {
        const reservaActual = prevReservas.find(
          (reserva) => reserva.id === normalizedReservaIdToReplace,
        );

        if (!reservaActual) {
          result = { ok: false, error: "La reserva a cambiar no existe." };
          return prevReservas;
        }

        if (getReservaStatus(reservaActual, new Date()) !== "confirmada") {
          result = {
            ok: false,
            error: "Solo podés cambiar reservas confirmadas.",
          };
          return prevReservas;
        }

        const updated = prevReservas.map((reserva) => {
          if (reserva.id !== normalizedReservaIdToReplace) {
            return reserva;
          }

          return {
            ...reserva,
            funcionId: normalizedFuncionId,
            asientos: uniqueAsientos,
            estado: "confirmada",
          };
        });

        result = { ok: true };
        return updated;
      }

      const nextId = prevReservas.reduce((maxId, reserva) => {
        return Math.max(maxId, reserva.id);
      }, 0);

      const nuevaReserva = {
        id: nextId + 1,
        usuarioId: 1,
        funcionId: normalizedFuncionId,
        asientos: uniqueAsientos,
        estado: "confirmada",
        creadaEn: new Date().toISOString(),
      };

      result = { ok: true };
      return [...prevReservas, nuevaReserva];
    });

    return result;
  }

  function cancelReserva(reservaId) {
    const normalizedReservaId = normalizeId(reservaId);

    if (normalizedReservaId === null) {
      return { ok: false, error: "Reserva inválida." };
    }

    let result = { ok: false, error: "No se pudo cancelar la reserva." };

    setReservas((prevReservas) => {
      const reserva = prevReservas.find((r) => r.id === normalizedReservaId);

      if (!reserva) {
        result = { ok: false, error: "La reserva no existe." };
        return prevReservas;
      }

      if (getReservaStatus(reserva, new Date()) !== "confirmada") {
        result = {
          ok: false,
          error: "Solo podés cancelar reservas confirmadas antes de que empiece la función.",
        };
        return prevReservas;
      }

      result = { ok: true };

      return prevReservas.map((item) => {
        if (item.id !== normalizedReservaId) {
          return item;
        }

        return {
          ...item,
          estado: "cancelada",
        };
      });
    });

    return result;
  }

  const reservasEnriquecidas = reservas
    .filter((reserva) => reserva.usuarioId === 1)
    .map((reserva) => {
      const funcion = getFuncionById(reserva.funcionId);
      const sala = funcion ? getSalaById(funcion.salaId) : null;

      return {
        ...reserva,
        funcion,
        sala,
        total: funcion ? reserva.asientos.length * funcion.precio : 0,
      };
    })
    .sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn));

  const value = {
    funciones,
    reservas: reservasEnriquecidas,
    getOccupiedSeats,
    createReserva,
    cancelReserva,
    getReservaStatus,
  };

  return <ReservasContext.Provider value={value}>{children}</ReservasContext.Provider>;
}

export function useReservas() {
  const context = useContext(ReservasContext);

  if (!context) {
    throw new Error("useReservas debe usarse dentro de ReservasProvider");
  }

  return context;
}
