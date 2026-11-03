import db from "./db.js";

const FORMATOS = ["2D", "3D", "4D"];
const IDIOMAS = ["Subtitulada", "Castellano"];

// Devuelve un texto con el error, o null si los datos de la función están bien
export function validarFuncion(body) {
  const { movieId, titulo, salaId, fecha, hora, formato, idioma, precio } = body;

  if (!movieId || !titulo || !salaId || !fecha || !hora || !formato || !idioma || precio === undefined) {
    return "Faltan datos de la función.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return "La fecha debe tener formato AAAA-MM-DD.";
  if (!/^\d{2}:\d{2}$/.test(hora)) return "La hora debe tener formato HH:MM.";
  if (!FORMATOS.includes(formato)) return "El formato debe ser 2D, 3D o 4D.";
  if (!IDIOMAS.includes(idioma)) return "El idioma debe ser Subtitulada o Castellano.";
  if (typeof precio !== "number" || precio <= 0) return "El precio debe ser un número mayor a 0.";

  const sala = db.prepare("SELECT id FROM salas WHERE id = ?").get(salaId);
  if (!sala) return "La sala no existe.";

  return null;
}

// Controla que los asientos (["A1","B4"]) existan en la sala. Devuelve un texto de error o null
export function validarAsientos(asientos, sala) {
  if (!Array.isArray(asientos) || asientos.length === 0) {
    return "Tenés que elegir al menos un asiento.";
  }
  if (new Set(asientos).size !== asientos.length) return "Hay asientos repetidos.";

  for (const asiento of asientos) {
    const partes = /^([A-Z])(\d+)$/.exec(asiento);
    if (!partes) return `El asiento ${asiento} no es válido.`;

    const fila = partes[1].charCodeAt(0) - 64; // A = 1, B = 2...
    const columna = Number(partes[2]);
    if (fila > sala.filas || columna < 1 || columna > sala.columnas) {
      return `El asiento ${asiento} no existe en la sala.`;
    }
  }
  return null;
}
