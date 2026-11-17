"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFunciones } from "../FuncionesContext";
import FuncionForm from "../FuncionForm";
import { enviarFuncion } from "../enviarFuncion";

export default function NuevaFuncionPage() {
  const router = useRouter();
  const { setFunciones } = useFunciones();
  const [formKey, setFormKey] = useState(0);

  function volverAlListado() {
    setFormKey((k) => k + 1);
    router.push("/admin/funciones");
  }

  async function guardar(datos) {
    const { funcion, error } = await enviarFuncion(datos);
    if (error) return error;

    setFunciones((prev) => [...prev, funcion]);
    volverAlListado();
    return null;
  }

  return (
    <main className="contenedor">
      <h1 className="titulo-pagina">Nueva función</h1>
      <FuncionForm
        key={formKey}
        textoBoton="Crear función"
        onGuardar={guardar}
        onCancelar={volverAlListado}
      />
    </main>
  );
}
