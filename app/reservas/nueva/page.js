export const instant = false;

import { connection } from "next/server";
import MapaAsientos from "../components/MapaAsientos";
import "../reservas.css";

export default async function NuevaReserva({ searchParams }) { //recibo los parametros de URL por searchParams, le mando a mapAsientos por props
  await connection();
  const { funcionId, reservaId } = await searchParams; //Funcion y serverca si exsite

  // El mapa busca la función y la sala desde la API.
  return (
    <main className="reservas">
      <MapaAsientos funcionId={Number(funcionId)} reservaId={Number(reservaId) || null} />
    </main>
  );
}
