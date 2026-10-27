import { ReservasProvider } from "./reservas/ReservasProvider";

export const metadata = {
  title: "ORTFlix",
  description: "Sistema de reservas de funciones",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ReservasProvider>{children}</ReservasProvider>
      </body>
    </html>
  );
}
