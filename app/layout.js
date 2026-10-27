import Header from "./components/Header";
import './global.css';

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
        {children}
      </body>
    </html>
  );
}
