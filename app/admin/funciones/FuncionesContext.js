"use client";

import { createContext, useContext, useState } from "react";
import { funciones as funcionesMock, salas as salasMock } from "@/src/data/mock";

const FuncionesContext = createContext(null);

export function FuncionesProvider({ children }) {
  const [funciones, setFunciones] = useState(() => funcionesMock.map((f) => ({ ...f })));
  const [salas] = useState(() => salasMock.map((s) => ({ ...s })));

  return (
    <FuncionesContext.Provider value={{ funciones, setFunciones, salas }}>
      {children}
    </FuncionesContext.Provider>
  );
}

export function useFunciones() {
  return useContext(FuncionesContext);
}