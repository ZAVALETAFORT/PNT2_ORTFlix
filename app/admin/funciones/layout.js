import "./funciones.css";
import { FuncionesProvider } from "./FuncionesContext";
import RutaProtegida from "../../components/RutaProtegida";

// Todas las pantallas de administrar funciones exigen rol admin:
// sin sesión se redirige a /login y con rol cliente, al home.
export default function FuncionesLayout({ children }) {
  return (
    <FuncionesProvider>
      <RutaProtegida rol="admin">{children}</RutaProtegida>
    </FuncionesProvider>
  );
}
