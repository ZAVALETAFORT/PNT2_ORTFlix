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
          <ReservasProvider>

            {children}

          </ReservasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
