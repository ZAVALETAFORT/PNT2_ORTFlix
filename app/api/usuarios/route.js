import db from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { error, leerBody, usuarioAJson } from "@/lib/api";

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const usuarios = db.prepare("SELECT * FROM usuarios ORDER BY id").all();
  return Response.json(usuarios.map(usuarioAJson));
}

export async function POST(request) {
  const body = await leerBody(request);
  const { nombre, email, password, rol } = body;

  if (!nombre || !email || !password) {
    return error(400, "Faltan datos del usuario.");
  }
  if (!emailValido(email)) {
    return error(400, "El email no tiene un formato válido.");
  }
  if (String(password).length < 6) {
    return error(400, "La contraseña debe tener al menos 6 caracteres.");
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const existente = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(emailNormalizado);
  if (existente) {
    return error(409, "Ya existe un usuario con ese email.");
  }

  const rolFinal = rol === "admin" ? "admin" : "cliente";
  const resultado = db
    .prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)")
    .run(String(nombre).trim(), emailNormalizado, hashPassword(password), rolFinal);

  const usuario = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(resultado.lastInsertRowid);
  return Response.json(usuarioAJson(usuario), { status: 201 });
}