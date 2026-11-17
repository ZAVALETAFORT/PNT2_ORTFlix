"use client";

import Link from "next/link";
import { useReservas } from "./ReservasProvider";
import { useEffect, useState } from "react";
import "./reservas.css";

export default function MisReservas() {
  const {
    reservas,
    funciones,
    salas,
    cancelarReserva,
    cargandoReservas,
    errorReservas,
  } = useReservas();

  const [confirmandoId, setConfirmandoId] = useState(null);
  const [cambiandoId, setCambiandoId] = useState(null);
  const [error, setError] = useState("");

  const [cancelandoId, setCancelandoId] = useState(null);

  const [ahora, setAhora] = useState(null);

  // Marca como finalizadas las funciones que ya pasaron.
  useEffect(() => {
    const timer = setTimeout(() => setAhora(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []);


  // Confirma la cancelación y actualiza el listado.
  async function confirmarCancelacion(id) {
    setCancelandoId(id);
    try {
      const resultado = await cancelarReserva(id);
      setError(resultado.ok ? "" : resultado.message);
      if (resultado.ok) setConfirmandoId(null);
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <main className="reservas">
      <h1>Mis reservas</h1>

      {cargandoReservas && <p>Cargando reservas...</p>}
      {errorReservas && <p className="error" role="alert">{errorReservas}</p>}

      {!cargandoReservas && !errorReservas && reservas.length === 0 && (
        <p>Todavía no tenés reservas.</p>
      )}

      {!cargandoReservas &&
        !errorReservas &&
        reservas.map((reserva) => {
          const funcion = funciones.find((f) => f.id === reserva.funcionId);
          const sala = salas.find((s) => s.id === funcion?.salaId);

          if (!funcion) return null;

          const finalizada =
            reserva.estado === "confirmada" &&
            ahora !== null &&
            new Date(`${funcion.fecha}T${funcion.hora}:00`).getTime() <= ahora;

          const estado = finalizada ? "finalizada" : reserva.estado;

          // Buscar otras funciones futuras de la misma película
          const alternativas = funciones.filter(
            (f) =>
              f.movieId === funcion.movieId &&
              f.id !== funcion.id &&
              ahora !== null &&
              new Date(`${f.fecha}T${f.hora}:00`).getTime() > ahora,
          );

          return (
            <div
              key={reserva.id}
              className="reserva"
            >
              <h2>{funcion.titulo}</h2>
              <p>
                Fecha: {funcion.fecha} - {funcion.hora}
              </p>
              <p>
                Formato: {funcion.formato} - {funcion.idioma}
              </p>
              <p>Sala: {sala?.nombre}</p>
              <p>Asientos: {reserva.asientos.join(", ") || "Sin asientos"}</p>
              <p>Total: ${reserva.asientos.length * funcion.precio}</p>
              <p>Estado: <span className={`estado-${estado}`}>{estado}</span></p>

              {estado === "confirmada" && (
                <div className="acciones">
                  {confirmandoId === reserva.id ? (
                    <>
                      <p>¿Seguro que querés cancelar esta reserva?</p>

                      <button
                        type="button"
                        onClick={() => confirmarCancelacion(reserva.id)}
                        disabled={cancelandoId === reserva.id}
                      >
                        Sí, cancelar
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmandoId(null)}
                        disabled={cancelandoId === reserva.id}
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setConfirmandoId(reserva.id);
                      }}
                    >
                      Cancelar reserva
                    </button>
                  )}

                  {confirmandoId === reserva.id && error && <p className="error">{error}</p>}

                  <button
                    type="button"
                    onClick={() =>
                      setCambiandoId(
                        cambiandoId === reserva.id ? null : reserva.id,
                      )
                    }
                  >
                    Cambiar función
                  </button>

                  {cambiandoId === reserva.id && (
                    <div>
                      <h3>Elegí otra función</h3>

                      {alternativas.length === 0 && (
                        <p>
                          No hay otras funciones disponibles para esta película.
                        </p>
                      )}

                      {alternativas.map((f) => (
                        <p key={f.id}>
                          <Link
                            href={`/reservas/nueva?funcionId=${f.id}&reservaId=${reserva.id}`}
                          >
                            {f.fecha} - {f.hora} | {f.formato} | {f.idioma}
                          </Link>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

      <p className="volver">
        <Link href="/">Volver a cartelera</Link>
      </p>
    </main>
  );
}
