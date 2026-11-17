import { mananaISO } from "./fechas";


export function validarFormulario(valores, funciones, idExcluir = null) {
  const errores = {};

  if (!valores.movieId) errores.movieId = "Elegí una película.";
  if (!valores.salaId) errores.salaId = "Elegí una sala.";
  if (!valores.formato) errores.formato = "Elegí un formato.";
  if (!valores.idioma) errores.idioma = "Elegí un idioma.";


  const fechaOriginal = funciones.find((f) => f.id === idExcluir)?.fecha;
  if (!valores.fecha) errores.fecha = "Elegí una fecha.";
  else if (valores.fecha !== fechaOriginal && valores.fecha < mananaISO()) {
    errores.fecha = "La fecha tiene que ser a partir de mañana.";
  }

  if (!valores.hora) errores.hora = "Elegí una hora.";

  if (valores.precio === "" || valores.precio === undefined || valores.precio === null) {
    errores.precio = "Ingresá el precio.";
  } else if (!(Number(valores.precio) > 0)) {
    errores.precio = "El precio tiene que ser mayor a 0.";
  }

  if (valores.salaId && valores.fecha && valores.hora) {
    const superpuesta = funciones.some(
      (f) =>
        f.id !== idExcluir &&
        f.salaId === Number(valores.salaId) &&
        f.fecha === valores.fecha &&
        f.hora === valores.hora
    );
    if (superpuesta) errores.hora = "Ya hay una función en esa sala, ese día y a esa hora.";
  }

  return errores;
}
