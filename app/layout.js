import Header from "./components/Header";
import { AuthProvider } from "./components/AuthProvider";
import "./global.css";

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
