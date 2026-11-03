"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FuncionesContext = createContext(null);

export function FuncionesProvider({ children }) {
  const [funciones, setFunciones] = useState([]);
  const [salas, setSalas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Las funciones y las salas salen de la API (la misma base que usan las reservas)
  useEffect(() => {
    async function cargar() {
      try {
        const [resFunciones, resSalas] = await Promise.all([
          fetch("/api/funciones", { cache: "no-store" }),
          fetch("/api/salas", { cache: "no-store" }),
        ]);
        if (!resFunciones.ok || !resSalas.ok) throw new Error("Error al cargar");
        setFunciones(await resFunciones.json());
        setSalas(await resSalas.json());
      } catch {
        setError("No se pudieron cargar las funciones. Intentá de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <FuncionesContext.Provider value={{ funciones, setFunciones, salas, cargando, error }}>
      {children}
    </FuncionesContext.Provider>
  );
}

export function useFunciones() {
  return useContext(FuncionesContext);
}
