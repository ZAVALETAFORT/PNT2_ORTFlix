import { ReservasProvider } from "./ReservasProvider";
import RutaProtegida from "../components/RutaProtegida";

// ReservasProvider solo se necesita en las páginas de /reservas, por eso se monta acá y no en el layout de toda la app.
// Todas las páginas de /reservas piden sesión: sin sesión se redirige a /login.
export default function ReservasLayout({ children }) {
  return (
    <ReservasProvider>
      <RutaProtegida>{children}</RutaProtegida>
    </ReservasProvider>
  );
}
