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