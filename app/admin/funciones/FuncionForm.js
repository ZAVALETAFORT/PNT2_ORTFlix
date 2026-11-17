"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useFunciones } from "./FuncionesContext";
import { validarFormulario } from "@/app/components/funcion/validarFormulario";
import { mananaISO } from "@/app/components/funcion/fechas";

const FORMATOS = ["2D", "3D", "4D"];
const IDIOMAS = ["Subtitulada", "Castellano"];

// La fecha de mañana solo se lee en el navegador (en el servidor vale ""), para evitar errores de hydration
function suscribirseSinCambios() {
  return () => {};
}

// Pasa una función del contrato a los valores del formulario (los inputs trabajan con strings)
function aValores(funcion) {
  return {
    movieId: funcion?.movieId ? String(funcion.movieId) : "",
    salaId: funcion?.salaId ? String(funcion.salaId) : "",
    fecha: funcion?.fecha ?? "",
    hora: funcion?.hora ?? "",
    formato: funcion?.formato ?? "",
    idioma: funcion?.idioma ?? "",
    precio: funcion?.precio !== undefined ? String(funcion.precio) : "",
  };
}

// Formulario para crear y para editar funciones.
// onGuardar(datos) recibe la función con la forma del contrato y devuelve un mensaje de error o null.
export default function FuncionForm({ inicial, funcionId = null, textoBoton, onGuardar, onCancelar }) {
  const { funciones, salas } = useFunciones();
  const [valores, setValores] = useState(() => aValores(inicial));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const manana = useSyncExternalStore(suscribirseSinCambios, mananaISO, () => "");

  // El calendario arranca mañana; al editar una función más vieja, también deja su fecha original
  let fechaMinima = manana;
  if (manana && inicial?.fecha && inicial.fecha < manana) fechaMinima = inicial.fecha;

  const [peliculas, setPeliculas] = useState([]);
  const [cargandoPeliculas, setCargandoPeliculas] = useState(true);
  const [errorPeliculas, setErrorPeliculas] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch("/api/peliculas");
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        setPeliculas(data.map((p) => ({ id: p.id, titulo: p.title })));
      } catch {
        setErrorPeliculas("No se pudo cargar la cartelera.");
      } finally {
        setCargandoPeliculas(false);
      }
    }
    cargar();
  }, []);

  // Si se está editando una función cuya película ya no está en cartelera, se agrega igual
  const opcionesPeliculas = [...peliculas];
  if (inicial?.movieId && !peliculas.some((p) => p.id === inicial.movieId)) {
    opcionesPeliculas.unshift({ id: inicial.movieId, titulo: inicial.titulo });
  }

  function cambiar(e) {
    const { name } = e.target;
    let { value } = e.target;
    // El precio solo acepta dígitos
    if (name === "precio") value = value.replace(/\D/g, "");
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErrorServidor("");

    const nuevosErrores = validarFormulario(valores, funciones, funcionId);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const pelicula = opcionesPeliculas.find((p) => p.id === Number(valores.movieId));
    const datos = {
      movieId: Number(valores.movieId),
      titulo: pelicula?.titulo ?? "",
      salaId: Number(valores.salaId),
      fecha: valores.fecha,
      hora: valores.hora,
      formato: valores.formato,
      idioma: valores.idioma,
      precio: Number(valores.precio),
    };

    setEnviando(true);
    const mensaje = await onGuardar(datos);
    setEnviando(false);
    if (mensaje) setErrorServidor(mensaje);
  }

  return (
    <form className="form-funcion" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="movieId">Película</label>
        <select id="movieId" name="movieId" value={valores.movieId} onChange={cambiar} disabled={cargandoPeliculas}>
          <option value="">{cargandoPeliculas ? "Cargando cartelera..." : "Elegí una película"}</option>
          {opcionesPeliculas.map((p) => (
            <option key={p.id} value={p.id}>{p.titulo}</option>
          ))}
        </select>
        {errorPeliculas && <p className="error-campo">{errorPeliculas}</p>}
        {errores.movieId && <p className="error-campo">{errores.movieId}</p>}
      </div>

      <div className="campo">
        <label htmlFor="salaId">Sala</label>
        <select id="salaId" name="salaId" value={valores.salaId} onChange={cambiar}>
          <option value="">Elegí una sala</option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        {errores.salaId && <p className="error-campo">{errores.salaId}</p>}
      </div>

      <div className="campos-fila">
        <div className="campo">
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            min={fechaMinima || undefined}
            value={valores.fecha}
            onChange={cambiar}
          />
          {errores.fecha && <p className="error-campo">{errores.fecha}</p>}
        </div>

        <div className="campo">
          <label htmlFor="hora">Hora</label>
          <input id="hora" name="hora" type="time" value={valores.hora} onChange={cambiar} />
          {errores.hora && <p className="error-campo">{errores.hora}</p>}
        </div>
      </div>

      <div className="campos-fila">
        <div className="campo">
          <label htmlFor="formato">Formato</label>
          <select id="formato" name="formato" value={valores.formato} onChange={cambiar}>
            <option value="">Elegí un formato</option>
            {FORMATOS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {errores.formato && <p className="error-campo">{errores.formato}</p>}
        </div>

        <div className="campo">
          <label htmlFor="idioma">Idioma</label>
          <select id="idioma" name="idioma" value={valores.idioma} onChange={cambiar}>
            <option value="">Elegí un idioma</option>
            {IDIOMAS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {errores.idioma && <p className="error-campo">{errores.idioma}</p>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="text"
          inputMode="numeric"
          value={valores.precio}
          onChange={cambiar}
        />
        {errores.precio && <p className="error-campo">{errores.precio}</p>}
      </div>

      {errorServidor && <p className="mensaje-error">{errorServidor}</p>}

      <div className="acciones-form">
        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? "Guardando..." : textoBoton}
        </button>
        <button type="button" className="boton boton-secundario" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
