"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Sesión del usuario compartida por toda la app (estado global).
// Se guarda también en localStorage con las claves del contrato (README): "token", "user" y "userEmail",
// así la sesión se mantiene al recargar la página.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true); // hasta leer localStorage no sabemos si hay sesión

  // localStorage solo existe en el navegador: hay que leerlo en un efecto
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsuario(JSON.parse(localStorage.getItem("user")));
      setToken(localStorage.getItem("token"));
    } catch {
      // si los datos guardados están rotos, se ignoran y queda sin sesión
    }
    setCargando(false);
  }, []);

  // La usa el login después de autenticar
  function guardarSesion(nuevoToken, nuevoUsuario) {
    localStorage.setItem("token", nuevoToken);
    localStorage.setItem("user", JSON.stringify(nuevoUsuario));
    localStorage.setItem("userEmail", nuevoUsuario.email);
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, guardarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Uso: const { usuario, token, cerrarSesion } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
