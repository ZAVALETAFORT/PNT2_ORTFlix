import { connection } from "next/server";
import db from "@/lib/db";
import { salaAJson } from "@/lib/api";

export async function GET() {
  await connection(); // que se consulte en cada request y no al hacer el build
  const salas = db.prepare("SELECT * FROM salas ORDER BY id").all();
  return Response.json(salas.map(salaAJson));
}
