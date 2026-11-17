//Aca centralizo mi contexto, manejo reservas, funciones y salas, y las operaciones de crear, cancelar y cambiar reservas.
"use client"; 

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
  const pathname = usePathname();
  const { token, cargando: cargandoSesion, cerrarSesion } = useAuth();

  // Si al reservar o cancelar la API responde 401, la sesión venció (el token dura 2 horas).
  // Se cierra la sesión y la ruta protegida (RutaProtegida) manda sola al login.
  function sesionVencida() {
    cerrarSesion();
    return { ok: false, status: 401, message: "Tu sesión venció. Iniciá sesión de nuevo." };
  }

  const [reservas, setReservas] = useState([]);

  const [funciones, setFunciones] = useState([]);
  const [salas, setSalas] = useState([]);

  const [consulta, setConsulta] = useState({ ruta: null, error: "" });

  const cargandoReservas =
    pathname.startsWith("/reservas") && consulta.ruta !== pathname;

  const errorReservas = consulta.ruta === pathname ? consulta.error : "";

  // Trae las reservas del usuario, las funciones y las salas desde la API.

  useEffect(() => {
    if (!pathname.startsWith("/reservas")) return;

    // Hasta que el contexto lea la sesión guardada no se sabe si hay token
    if (cargandoSesion) return;

    let activo = true;

    //Consulta reservas, funciones y salas
    async function cargarDatos() {
      try {
        const resReservas = await fetch("/api/reservas", {
          headers: { Authorization: `Bearer ${token || ""}` },
          cache: "no-store",
        });

        // La sesión venció: se cierra y la ruta protegida redirige al login
        if (resReservas.status === 401) {
          cerrarSesion();
          return;
        }

        const resFunciones = await fetch("/api/funciones", { cache: "no-store" });
        const resSalas = await fetch("/api/salas", { cache: "no-store" });

        if (!resReservas.ok) throw new Error("Necesitás iniciar sesión.");
        if (!resFunciones.ok || !resSalas.ok) throw new Error("No se pudieron cargar los datos.");

        if (activo) {
          setReservas(await resReservas.json());
          setFunciones(await resFunciones.json());
          setSalas(await resSalas.json());
          setConsulta({ ruta: pathname, error: "" });
        }
      } catch (error) {
        if (activo) {
          setReservas([]);
          setFunciones([]);
          setSalas([]);
          setConsulta({ ruta: pathname, error: error.message });
        }
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [pathname, cargandoSesion, token, cerrarSesion]);

  //Valido el array de asientos (1 al 10), que el usuario este logueado y que la funcion no haya comenzado.Mando POST a la API
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

      if (res.status === 401) return sesionVencida();

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

  // Envía las cancelaciones y cambios a la API. Mando el PUT a la API
  async function actualizarReserva(id, body) {
    if (!token) return { ok: false, message: "Necesitás iniciar sesión." };

    try {
      const res = await fetch(`/api/reservas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 401) return sesionVencida();

      const datos = await res.json();
      if (!res.ok) return { ok: false, status: res.status, message: datos.message || "No se pudo actualizar la reserva." };

      setReservas((anteriores) => anteriores.map((r) => r.id === id ? datos : r));
      return { ok: true };
    } catch {
      return { ok: false, message: "Error de conexión con el servidor." };
    }
  }

  // Cancela la reserva si la función todavía no comenzó.
  function cancelarReserva(id) {
    const reserva = reservas.find((r) => r.id === id);
    const funcion = funciones.find((f) => f.id === reserva?.funcionId);
    if (!reserva || !funcion || reserva.estado !== "confirmada" ||
        new Date(`${funcion.fecha}T${funcion.hora}:00`) <= new Date()) {
      return { ok: false, message: "No se puede cancelar esta reserva." };
    }
    return actualizarReserva(id, { estado: "cancelada" });
  }

  // Cambia a otra función futura de la misma película.
  function cambiarReserva(id, funcionId, asientos) {
    const reserva = reservas.find((r) => r.id === id);
    const actual = funciones.find((f) => f.id === reserva?.funcionId);
    const nueva = funciones.find((f) => f.id === funcionId);
    if (!reserva || !actual || !nueva || reserva.estado !== "confirmada" ||
        actual.movieId !== nueva.movieId || actual.id === nueva.id ||
        new Date(`${actual.fecha}T${actual.hora}:00`) <= new Date() ||
        new Date(`${nueva.fecha}T${nueva.hora}:00`) <= new Date()) {
      return { ok: false, message: "No se puede cambiar esta función." };
    }
    if (!Array.isArray(asientos) || asientos.length === 0 || asientos.length > 10 ||
        new Set(asientos).size !== asientos.length) {
      return { ok: false, message: "Seleccioná entre 1 y 10 asientos distintos." };
    }
    return actualizarReserva(id, { funcionId, asientos });
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
        salas,
        funciones,
      }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  return useContext(ReservasContext);
}
