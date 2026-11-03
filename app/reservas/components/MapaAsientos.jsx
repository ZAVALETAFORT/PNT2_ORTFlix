"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useReservas } from "../ReservasProvider";

export default function MapaAsientos({ funcionId, reservaId }) {
  const router = useRouter();
  const { funciones, salas, crearReserva, cambiarReserva, cargandoReservas, errorReservas } = useReservas();
  const funcion = funciones.find((f) => f.id === funcionId);
  const sala = salas.find((s) => s.id === funcion?.salaId);

  const [seleccionados, setSeleccionados] = useState([]);

  const [enviando, setEnviando] = useState(false);

  const [ocupacionApi, setOcupacionApi] = useState({
    funcionId: null,
    asientos: [],
    error: null,
  });

  // Consultar asientos ocupados de la funcion en SQLite
  useEffect(() => {
    let activo = true;

    fetch(`/api/funciones/${funcionId}/asientos-ocupados`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo consultar la disponibilidad.");
        return res.json();
      })
      .then((asientos) => {
        if (activo) {
          setOcupacionApi({ funcionId, asientos, error: null });
        }
      })
      .catch((error) => {
        if (activo) {
          setOcupacionApi({ funcionId, asientos: [], error: error.message });
        }
      });

    return () => {
      activo = false;
    };
  }, [funcionId]);

  const cargando = ocupacionApi.funcionId !== funcionId;
  const errorOcupacion = !cargando && ocupacionApi.error;

  const [mensaje, setMensaje] = useState("");

  // Datos de la película (póster y sinopsis) para mostrarlos al lado del mapa
  const [pelicula, setPelicula] = useState(null);
  const [peliculaError, setPeliculaError] = useState(false);
  const movieId = funcion?.movieId;

  useEffect(() => {
    if (!movieId) return;
    let activo = true;

    fetch(`/api/peliculas/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo consultar la película.");
        return res.json();
      })
      .then((datos) => {
        if (activo) setPelicula(datos);
      })
      .catch(() => {
        if (activo) setPeliculaError(true);
      });

    return () => {
      activo = false;
    };
  }, [movieId]);

  // Usa la disponibilidad de asientos
  const ocupadosActuales = cargando ? [] : ocupacionApi.asientos;

  // Marca o desmarca un asiento, hasta un max de 10
  function seleccionarAsiento(asiento) {
    if (ocupadosActuales.includes(asiento)) return;

    setMensaje("");

    if (seleccionados.includes(asiento)) {
      setSeleccionados(seleccionados.filter((a) => a !== asiento));
    } else if (seleccionados.length < 10) {
      setSeleccionados([...seleccionados, asiento]);
    }
  }

  // Guarda una reserva nueva o cambia de función.
  async function confirmarReserva() {
    if (enviando) return;
    if (new Date(`${funcion.fecha}T${funcion.hora}:00`) <= new Date()) {
      setMensaje("La función ya comenzó.");
      return;
    }
    setEnviando(true);

    try {
      const resultado = reservaId
        ? await cambiarReserva(reservaId, funcionId, seleccionados)
        : await crearReserva(funcionId, seleccionados);

      if (!resultado || (typeof resultado === "object" && !resultado.ok)) {
        setMensaje(resultado?.message || "No se pudo confirmar la reserva.");

        // Si otro usuario ocupó los asientos, refrescar el mapa
        if (resultado?.status === 409) {
          const res = await fetch(
            `/api/funciones/${funcionId}/asientos-ocupados`,
            { cache: "no-store" },
          );

          if (res.ok) {
            const asientos = await res.json();
            setOcupacionApi({ funcionId, asientos, error: null });
          }

          setSeleccionados([]);
        }

        return;
      }

      router.push("/reservas");
    } catch {
      setOcupacionApi({ funcionId, asientos: [], error: "No se pudo actualizar la disponibilidad." });
      setMensaje("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoReservas) return <p>Cargando función...</p>;
  if (errorReservas) return <p className="error">{errorReservas}</p>;
  if (!funcion || !sala) return <p>Función no encontrada.</p>;

  const filas = Array.from({ length: sala.filas }, (_, i) => String.fromCharCode(65 + i));
  const columnas = Array.from({ length: sala.columnas }, (_, i) => i + 1);

  return (
    <div className="reserva-layout">
      <div>
      <h1>{funcion.titulo}</h1>
      <p>{funcion.fecha} - {funcion.hora} | {funcion.formato} | {funcion.idioma} | {sala.nombre}</p>
      <h2>Seleccioná tus asientos</h2>
      {cargando && <p>Cargando disponibilidad...</p>}
      {errorOcupacion && <p className="error" role="alert">{errorOcupacion}</p>}
      <div className="sala">
      <div className="pantalla">PANTALLA</div>

      {filas.map((fila) => (
        <div key={fila} className="fila">
          <strong>{fila}</strong>

          {columnas.map((columna) => {
            const asiento = `${fila}${columna}`;
            const ocupado = ocupadosActuales.includes(asiento);
            const seleccionado = seleccionados.includes(asiento);

            return (
              <button
                key={asiento}
                type="button"
                disabled={ocupado || cargando || !!errorOcupacion || enviando}
                onClick={() => seleccionarAsiento(asiento)}
                aria-label={`Asiento ${asiento}`}
                aria-pressed={seleccionado}
                className={ocupado ? "asiento ocupado" : seleccionado ? "asiento seleccionado" : "asiento"}
              >
                {columna}
              </button>
            );
          })}
        </div>
      ))}
      </div>

      <ul className="leyenda">
        <li><span className="muestra libre" /> Libre</li>
        <li><span className="muestra seleccionado" /> Seleccionado</li>
        <li><span className="muestra ocupado" /> Ocupado</li>
      </ul>

      <h3>Resumen de la reserva</h3>
      <p>Asientos: {seleccionados.join(", ") || "Ninguno"}</p>
      <p>Cantidad: {seleccionados.length}</p>
      <p>Total: ${funcion.precio * seleccionados.length}</p>

      {seleccionados.length === 10 && <p>Máximo de 10 asientos.</p>}

      <button
        type="button"
        disabled={
          seleccionados.length === 0 || cargando || !!errorOcupacion || enviando
        }
        onClick={confirmarReserva}
        className="confirmar"
      >
        {reservaId ? "Confirmar cambio" : "Confirmar reserva"}
      </button>

      {mensaje && <p className="error">{mensaje}</p>}
      </div>

      <aside className="pelicula-panel">
        {pelicula ? (
          <>
            {pelicula.poster && <img src={pelicula.poster} alt={pelicula.titulo} />}
            <h2>{pelicula.titulo}</h2>
            <p className="pelicula-datos">
              {pelicula.fechaEstreno && `Estreno: ${new Date(`${pelicula.fechaEstreno}T00:00:00`).toLocaleDateString("es-AR")} | `}
              Puntaje: {pelicula.puntaje ? pelicula.puntaje.toFixed(1) : "-"}
            </p>
            <p className="pelicula-sinopsis">{pelicula.sinopsis || "Sin descripción disponible."}</p>
          </>
        ) : (
          <p className="pelicula-estado">
            {peliculaError ? "No se pudo cargar la información de la película." : "Cargando película..."}
          </p>
        )}
      </aside>
    </div>
  );
}
