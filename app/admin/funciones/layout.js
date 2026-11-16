import "./funciones.css";
import { FuncionesProvider } from "./FuncionesContext";
import RutaProtegida from "@/app/components/RutaProtegida";

// Todo /admin/funciones requiere rol admin: un cliente vuelve al home y sin sesión va a /login
export default function FuncionesLayout({ children }) {
  return (
    <RutaProtegida rol="admin">
      <FuncionesProvider>{children}</FuncionesProvider>
    </RutaProtegida>
  );
}
