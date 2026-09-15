/** Construye enlaces de WhatsApp centralizados. No hardcodear números en componentes. */

export function cleanNumber(n: string): string {
  return (n || "").replace(/\D/g, "");
}

export function buildWaLink(number: string, message: string): string {
  const clean = cleanNumber(number);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Enlace de consulta por área: "Hola LEXUM, necesito ayuda en {área}..." */
export function areaLink(areaName: string, waNumber: string): string {
  return buildWaLink(
    waNumber,
    `Hola LEXUM, necesito asesoría en materia ${areaName}. ¿Me pueden agendar una cita?`
  );
}

export type CitaDatos = {
  nombre: string;
  area: string;
  mensaje: string;
};

/** Arma el mensaje del formulario Agendar cita. */
export function citaLink(d: CitaDatos, waNumber: string): string {
  const nombre = d.nombre.trim() || "un cliente";
  const area = d.area.trim() || "asesoría general";
  const extra = d.mensaje.trim();
  const texto =
    `Hola LEXUM, soy ${nombre}. ` +
    `Quiero agendar una cita de ${area}.` +
    (extra ? ` Mi caso: ${extra}` : "");
  return buildWaLink(waNumber, texto);
}

export function telLink(waNumber: string): string {
  return `tel:+${cleanNumber(waNumber)}`;
}

export function mailLink(email: string): string {
  return `mailto:${email}?subject=${encodeURIComponent("Solicitud de cita · LEXUM")}`;
}
