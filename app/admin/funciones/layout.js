import "./funciones.css";
import { FuncionesProvider } from "./FuncionesContext";

export default function FuncionesLayout({ children }) {
  return <FuncionesProvider>{children}</FuncionesProvider>;
}