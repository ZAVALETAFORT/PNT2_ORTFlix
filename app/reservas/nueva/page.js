export const instant = false;

import ReservaNuevaClient from "./ReservaNuevaClient";

function parseQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function NuevaReservaPage({ searchParams }) {
  const params = await searchParams;

  const funcionId = Number.parseInt(parseQueryValue(params.funcionId), 10);
  const reservaId = Number.parseInt(parseQueryValue(params.reservaId), 10);

  return (
    <ReservaNuevaClient
      funcionId={Number.isFinite(funcionId) ? funcionId : null}
      reservaId={Number.isFinite(reservaId) ? reservaId : null}
    />
  );
}
