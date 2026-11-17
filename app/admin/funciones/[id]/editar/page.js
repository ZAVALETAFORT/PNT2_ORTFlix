"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFunciones } from "../../FuncionesContext";
import { useAuth } from "@/app/components/AuthProvider";
import FuncionForm from "../../FuncionForm";
import { enviarFuncion } from "../../enviarFuncion";

export default function EditarFuncionPage() {
  const router = useRouter();
  const { id } = useParams();
  const { funciones, setFunciones, cargando, error } = useFunciones();
  const { token } = useAuth();

  const funcion = funciones.find((f) => f.id === Number(id));
  // La función no existe hasta que carga la lista: el id se saca una sola vez y de forma segura
  const funcionId = funcion?.id;

  async function guardar(datos) {
    const resultado = await enviarFuncion(datos, token, funcionId);
    if (resultado.error) return resultado.error;

    setFunciones((prev) => prev.map((f) => (f.id === funcionId ? resultado.funcion : f)));
    router.push("/admin/funciones");
    return null;
  }

  return (
    <main className="contenedor">
      <h1 className="titulo-pagina">Editar función</h1>

      {cargando && <p>Cargando función...</p>}

      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && !funcion && (
        <>
          <p>La función no existe.</p>
          <Link href="/admin/funciones">Volver al listado</Link>
        </>
      )}

      {!cargando && !error && funcion && (
        <FuncionForm
          inicial={funcion}
          funcionId={funcion.id}
          textoBoton="Guardar cambios"
          onGuardar={guardar}
          onCancelar={() => router.push("/admin/funciones")}
        />
      )}
    </main>
  );
}
