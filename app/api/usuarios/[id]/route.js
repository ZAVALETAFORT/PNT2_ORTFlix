import db from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { error, leerBody, usuarioAJson } from "@/lib/api";

function buscarUsuario(id) {
  return db.prepare("SELECT * FROM usuarios WHERE id = ?").get(Number(id));
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET(request, { params }) {
  const { id } = await params;
  const usuario = buscarUsuario(id);
  if (!usuario) return error(404, "El usuario no existe.");
  return Response.json(usuarioAJson(usuario));
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const usuario = buscarUsuario(id);
  if (!usuario) return error(404, "El usuario no existe.");

  const body = await leerBody(request);
  const { nombre, email, password, rol } = body;

  const nombreFinal = nombre !== undefined ? String(nombre).trim() : usuario.nombre;
  let emailFinal = usuario.email;
  if (email !== undefined) {
    if (!emailValido(email)) return error(400, "El email no tiene un formato válido.");
    emailFinal = String(email).trim().toLowerCase();
    const existente = db
      .prepare("SELECT id FROM usuarios WHERE email = ? AND id <> ?")
      .get(emailFinal, usuario.id);
    if (existente) return error(409, "Ya existe un usuario con ese email.");
  }

  let passwordFinal = usuario.password;
  if (password !== undefined) {
    if (String(password).length < 6) return error(400, "La contraseña debe tener al menos 6 caracteres.");
    passwordFinal = hashPassword(password);
  }

  const rolFinal = rol === "admin" || rol === "cliente" ? rol : usuario.rol;

  if (!nombreFinal) return error(400, "El nombre es obligatorio.");

  db.prepare("UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?").run(
    nombreFinal,
    emailFinal,
    passwordFinal,
    rolFinal,
    usuario.id
  );

  const actualizado = buscarUsuario(usuario.id);
  return Response.json(usuarioAJson(actualizado));
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const usuario = buscarUsuario(id);
  if (!usuario) return error(404, "El usuario no existe.");

  db.prepare("DELETE FROM usuarios WHERE id = ?").run(usuario.id);
  return Response.json({ message: "Usuario eliminado." });
}