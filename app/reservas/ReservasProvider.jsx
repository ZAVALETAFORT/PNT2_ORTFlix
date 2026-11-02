"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { funciones } from "@/src/data/mock";

const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
  const pathname = usePathname();

  const [reservas, setReservas] = useState([]);
  const [consulta, setConsulta] = useState({ ruta: null, error: "" });

  const cargandoReservas =
    pathname.startsWith("/reservas") && consulta.ruta !== pathname;

  const errorReservas = consulta.ruta === pathname ? consulta.error : "";

  // Consultar las reservas del usuario autenticado
  useEffect(() => {
    if (!pathname.startsWith("/reservas")) return;

    let activo = true;
    const token = localStorage.getItem("token");

    fetch("/api/reservas", {
      headers: { Authorization: `Bearer ${token || ""}` },
      cache: "no-store",
    })
      .then(async (res) => {
        const datos = await res.json();
        if (!res.ok)
          throw new Error(datos.message || "Error al consultar reservas.");
        return datos;
      })
      .then((datos) => {
        if (activo) {
          setReservas(datos);
          setConsulta({ ruta: pathname, error: "" });
        }
      })
      .catch((error) => {
        if (activo) {
          setReservas([]);
          setConsulta({ ruta: pathname, error: error.message });
        }
      });

    return () => {
      activo = false;
    };
  }, [pathname]);

  async function crearReserva(funcionId, asientos) {
    if (
      !Array.isArray(asientos) ||
      asientos.length === 0 ||
      asientos.length > 10 ||
      new Set(asientos).size !== asientos.length
    ) {
      return {
        ok: false,
        message: "Seleccioná entre 1 y 10 asientos distintos.",
      };
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { ok: false, message: "Necesitás iniciar sesión." };
      }

      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ funcionId, asientos }),
      });

      const datos = await res.json();

      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          message: datos.message || "No se pudo confirmar la reserva.",
        };
      }

      setReservas((anteriores) => [...anteriores, datos]);

      return { ok: true };
    } catch {
      return { ok: false, message: "Error de conexión con el servidor." };
    }
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
      anteriores.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r)),
    );

    return true;
  }

  // Cambiar una reserva a otra función de la misma película
  function cambiarReserva(id, nuevaFuncionId, asientos) {
    const reserva = reservas.find((r) => r.id === id && r.usuarioId === 2);
    const funcionActual = funciones.find((f) => f.id === reserva?.funcionId);
    const funcionNueva = funciones.find((f) => f.id === nuevaFuncionId);

    if (
      !reserva ||
      !funcionActual ||
      !funcionNueva ||
      reserva.estado !== "confirmada" ||
      funcionActual.movieId !== funcionNueva.movieId ||
      funcionActual.id === funcionNueva.id
    ) {
      return false;
    }

    // Ambas funciones deben ser futuras
    const ahora = new Date();

    if (
      new Date(`${funcionActual.fecha}T${funcionActual.hora}:00`) <= ahora ||
      new Date(`${funcionNueva.fecha}T${funcionNueva.hora}:00`) <= ahora
    ) {
      return false;
    }

    // Validar cantidad y disponibilidad
    const ocupados = reservas
      .filter(
        (r) =>
          r.id !== id &&
          r.funcionId === nuevaFuncionId &&
          r.estado === "confirmada",
      )
      .flatMap((r) => r.asientos);

    if (
      !Array.isArray(asientos) ||
      asientos.length === 0 ||
      asientos.length > 10 ||
      new Set(asientos).size !== asientos.length ||
      asientos.some((a) => ocupados.includes(a))
    ) {
      return false;
    }

    // Actualizar la reserva y liberar los asientos anteriores
    setReservas((anteriores) =>
      anteriores.map((r) =>
        r.id === id
          ? { ...r, funcionId: nuevaFuncionId, asientos: [...asientos] }
          : r,
      ),
    );

    return true;
  }

  return (
    <ReservasContext.Provider
      value={{
        reservas,
        crearReserva,
        cancelarReserva,
        cambiarReserva,
        cargandoReservas,
        errorReservas,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  return useContext(ReservasContext);
}
