export const instant = false;

import { connection } from "next/server";
import ReservasPageClient from "./ReservasPageClient";

export default async function ReservasPage() {
  await connection();

  return <ReservasPageClient currentTimeIso={new Date().toISOString()} />;
}
