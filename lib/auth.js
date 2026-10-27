import { createHash } from "node:crypto";
import db from "./db.js";

// Backend del profesor: es el que hace el login y emite el token (JWT)
const AUTH_API_URL =
  process.env.AUTH_API_URL || "https://backendairbnb-befph8eegzabfudb.eastus2-01.azurewebsites.net";

export function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

// Lee el _id que viene dentro del JWT. Solo sirve para saber a quién preguntar:
// la firma del token la verifica el backend del profesor.
function leerIdDelToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString())._id;
  } catch {
    return null;
  }
}

// Lee el header "Authorization: Bearer <token>", le pregunta al backend del profesor si el
// token es válido y devuelve el usuario de NUESTRA base (lo crea la primera vez, como cliente).
// Devuelve null si no hay token, es inválido o venció.
export async function obtenerUsuario(request) {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return null;

  const token = header.replace("Bearer ", "").trim();
  const id = leerIdDelToken(token);
  if (!id) return null;

  let externo;
  try {
    const res = await fetch(`${AUTH_API_URL}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    externo = await res.json();
  } catch {
    return null;
  }

  // Se busca por email. Si no existe todavía, se crea (rol cliente por defecto)
  const email = externo.email.trim().toLowerCase();
  let usuario = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
  if (!usuario) {
    const resultado = db
      .prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)")
      .run(externo.username, email, "login-externo");
    usuario = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(resultado.lastInsertRowid);
  }
  return usuario;
}
