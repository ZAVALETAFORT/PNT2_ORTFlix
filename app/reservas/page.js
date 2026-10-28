"use client";

import Link from "next/link";
import { funciones, salas } from "@/src/data/mock";
import { useReservas } from "./ReservasProvider";
import { useEffect, useState } from "react";

export default function MisReservas() {
  const { reservas, cancelarReserva } = useReservas();
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [cambiandoId, setCambiandoId] = useState(null);
  const [error, setError] = useState("");

  const [ahora, setAhora] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAhora(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []);

  // Usuario de prueba del mock
  const misReservas = reservas.filter((r) => r.usuarioId === 2);

  return (
    <main style={{ padding: 20 }}>
      <h1>Mis reservas</h1>

      {misReservas.length === 0 && <p>Todavía no tenés reservas.</p>}

      {misReservas.map((reserva) => {
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
            style={{ border: "1px solid #aaa", padding: 15, marginTop: 15 }}
          >
            <h2>{funcion.titulo}</h2>
            <p>
              Fecha: {funcion.fecha} - {funcion.hora}
            </p>
            <p>
              Formato: {funcion.formato} - {funcion.idioma}
            </p>
            <p>Sala: {sala?.nombre}</p>
            <p>Asientos: {reserva.asientos.join(", ")}</p>
            <p>Total: ${reserva.asientos.length * funcion.precio}</p>
            <p>Estado: {estado}</p>

            {estado === "confirmada" && (
              <div>
                {confirmandoId === reserva.id ? (
                  <>
                    <p>¿Seguro que querés cancelar esta reserva?</p>

                    <button
                      onClick={() => {
                        if (cancelarReserva(reserva.id)) {
                          setConfirmandoId(null);
                          setError("");
                        } else {
                          setError("No se puede cancelar esta reserva.");
                        }
                      }}
                    >
                      Sí, cancelar
                    </button>

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
                            No hay otras funciones disponibles para esta
                            película.
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

                    <button onClick={() => setConfirmandoId(null)}>No</button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setError("");
                      setConfirmandoId(reserva.id);
                    }}
                  >
                    Cancelar reserva
                  </button>
                )}

                {confirmandoId === reserva.id && error && <p>{error}</p>}
              </div>
            )}
          </div>
        );
      })}

      <p style={{ marginTop: 20 }}>
        <Link href="/">Volver a cartelera</Link>
      </p>
    </main>
  );
}
