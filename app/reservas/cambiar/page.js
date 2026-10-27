export const instant = false;

import CambiarFuncionClient from "./CambiarFuncionClient";

function parseQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function CambiarFuncionPage({ searchParams }) {
  const params = await searchParams;
  const reservaId = Number.parseInt(parseQueryValue(params.reservaId), 10);

  return <CambiarFuncionClient reservaId={Number.isFinite(reservaId) ? reservaId : null} />;
}
