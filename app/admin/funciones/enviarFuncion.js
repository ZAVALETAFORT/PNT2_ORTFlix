// Crea (POST) o modifica (PUT, si viene id) una función en la API.
// Devuelve { funcion } si salió bien o { error } con el mensaje para mostrar.
export async function enviarFuncion(datos, id = null) {
  const token = localStorage.getItem("token");
  if (!token) return { error: "Iniciá sesión como administrador para guardar funciones." };

  try {
    const res = await fetch(id ? `/api/funciones/${id}` : "/api/funciones", {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data.message || "No se pudo guardar la función." };
    return { funcion: data };
  } catch {
    return { error: "Error de conexión con el servidor." };
  }
}
