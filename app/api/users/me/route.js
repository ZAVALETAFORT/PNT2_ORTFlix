import { obtenerUsuario } from "@/lib/auth";
import { error, usuarioAJson } from "@/lib/api";

// Devuelve el usuario del token, con su rol (el login del profesor no trae el rol)
export async function GET(request) {
  const usuario = await obtenerUsuario(request);
  if (!usuario) return error(401, "Necesitás iniciar sesión.");

  return Response.json(usuarioAJson(usuario));
}
