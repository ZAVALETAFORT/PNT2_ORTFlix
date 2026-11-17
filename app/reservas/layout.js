import { ReservasProvider } from "./ReservasProvider";

// ReservasProvider solo se necesita en las páginas de /reservas, por eso se monta acá y no en el layout de toda la app
export default function ReservasLayout({ children }) {
  return <ReservasProvider>{children}</ReservasProvider>;
}
