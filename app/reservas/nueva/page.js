export const instant = false;

import { connection } from "next/server";
import { funciones, salas, reservas } from "@/src/data/mock";
import MapaAsientos from "../components/MapaAsientos";

export default async function NuevaReserva({ searchParams }) {
  await connection();

  const { funcionId, reservaId } = await searchParams;

  // Buscar la función elegida
  const funcion = funciones.find((f) => f.id === Number(funcionId));

  if (!funcion) {
    return <p>Función no encontrada.</p>;
  }

  // Obtener la sala correspondiente
  const sala = salas.find((s) => s.id === funcion.salaId);

  if (!sala) {
    return <p>Sala no encontrada.</p>;
  }

  // Buscar asientos ocupados en reservas confirmadas
  const ocupados = reservas
    .filter((r) => r.funcionId === funcion.id && r.estado === "confirmada")
    .flatMap((r) => r.asientos);

  return (
    <main style={{ padding: 20 }}>
      <h1>{funcion.titulo}</h1>

      <p>
        {funcion.fecha} - {funcion.hora} | {funcion.formato} | {funcion.idioma}{" "}
        | {sala.nombre}
      </p>

      <MapaAsientos
        sala={sala}
        precio={funcion.precio}
        funcionId={funcion.id}
        reservaId={Number(reservaId) || null}
      />
    </main>
  );
}
