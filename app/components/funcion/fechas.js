export function aISO(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  
  export function hoyISO() {
    return aISO(new Date());
  }

  export function mananaISO() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    return aISO(fecha);
  }

  export function proximosDias(cantidad) {
    const dias = [];
    for (let i = 0; i < cantidad; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);
      let etiqueta;
      if (i === 0) etiqueta = "Hoy";
      else if (i === 1) etiqueta = "Mañana";
      else etiqueta = fecha.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "numeric" });
      dias.push({ iso: aISO(fecha), etiqueta });
    }
    return dias;
  }
  // "2026-11-05" -> "Jueves 5/11" (para agrupar funciones por día)
  export function etiquetaDia(iso) {
    const fecha = new Date(`${iso}T00:00:00`);
    const dia = fecha.toLocaleDateString("es-AR", { weekday: "long" });
    return `${dia[0].toUpperCase()}${dia.slice(1)} ${fecha.getDate()}/${fecha.getMonth() + 1}`;
  }

  // Agrupa una lista de funciones por fecha: [{ fecha, etiqueta, funciones }], ordenadas por día y hora
  export function agruparPorDia(funciones) {
    const ordenadas = [...funciones].sort((a, b) =>
      `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`)
    );
    const grupos = [];
    for (const f of ordenadas) {
      let grupo = grupos.find((g) => g.fecha === f.fecha);
      if (!grupo) {
        grupo = { fecha: f.fecha, etiqueta: etiquetaDia(f.fecha), funciones: [] };
        grupos.push(grupo);
      }
      grupo.funciones.push(f);
    }
    return grupos;
  }
