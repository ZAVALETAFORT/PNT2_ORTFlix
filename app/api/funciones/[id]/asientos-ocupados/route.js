import { connection } from "next/server";
import db from "@/lib/db";
import { error, asientosOcupados } from "@/lib/api";

export async function GET(request, { params }) {
  await connection();
  const { id } = await params;

  const funcion = db.prepare("SELECT id FROM funciones WHERE id = ?").get(Number(id));
  if (!funcion) return error(404, "La función no existe.");

  return Response.json(asientosOcupados(funcion.id));
}
