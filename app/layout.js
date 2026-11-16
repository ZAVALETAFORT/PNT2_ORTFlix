import { Suspense } from "react";
import Header from "./components/Header";
import { AuthProvider } from "./components/AuthProvider";
import "./global.css";
import { ReservasProvider } from "./reservas/ReservasProvider";

export const metadata = {
  title: "ORTFlix",
  description: "Cartelera de cine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Header />
          {/* ReservasProvider y algunas páginas leen la URL (usePathname, useParams): ese dato
              recién existe cuando entra el usuario, así que Next pide envolverlos en Suspense */}
          <Suspense fallback={<p className="contenedor">Cargando...</p>}>
            <ReservasProvider>{children}</ReservasProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
