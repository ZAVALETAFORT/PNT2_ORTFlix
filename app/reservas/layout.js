import RutaProtegida from "../components/RutaProtegida";

// /reservas y /reservas/nueva requieren sesión: sin sesión se redirige a /login
export default function ReservasLayout({ children }) {
  return <RutaProtegida>{children}</RutaProtegida>;
}
