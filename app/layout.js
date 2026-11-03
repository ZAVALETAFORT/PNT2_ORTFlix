import Header from "./components/Header";
import "./global.css";
import { ReservasProvider } from "./reservas/ReservasProvider";

export const metadata = {
  title: "ORTFlix",
  description: "Cartelera de cine",
};
//rama

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <ReservasProvider>
          
          {children}

        </ReservasProvider>
      </body>
    </html>
  );
}
