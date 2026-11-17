import { Suspense } from "react";
import Header from "./components/Header";
import { AuthProvider } from "./components/AuthProvider";
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
        <AuthProvider>
          <Header />
          {/* ReservasProvider usa usePathname: en las rutas dinámicas la URL se conoce recién al abrir la página,
              y Next exige envolver eso en Suspense para poder compilar */}
          <Suspense fallback={null}>
            <ReservasProvider>

              {children}

            </ReservasProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
