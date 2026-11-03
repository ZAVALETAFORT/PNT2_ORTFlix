export const instant = false;

import { connection } from "next/server";
import MapaAsientos from "../components/MapaAsientos";
import "../reservas.css";

export default async function NuevaReserva({ searchParams }) {
  await connection();
  const { funcionId, reservaId } = await searchParams;

  // El mapa busca la función y la sala desde la API.
  return (
    <main className="reservas">
      <MapaAsientos funcionId={Number(funcionId)} reservaId={Number(reservaId) || null} />
    </main>
  );
}
