"use client";

import { telLink } from "@/lib/whatsapp";

type Props = { waNumber: string; phoneDisplay: string };

/**
 * Barra fija SOLO en móvil (md:hidden): Llamar + Agendar.
 * Agendar lleva al formulario (único flujo hacia WhatsApp).
 * Respeta safe-area. En escritorio no se muestra.
 */
export default function StickyCallBar({ waNumber, phoneDisplay }: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-800/10 bg-white/95 px-3 pt-2 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={telLink(waNumber)}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-bold text-navy-800 ring-1 ring-navy-800/20 active:scale-[0.98]"
          aria-label={`Llamar al ${phoneDisplay}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
          </svg>
          Llamar
        </a>
        <a
          href="#agendar"
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-navy-800 text-[15px] font-bold text-white active:scale-[0.98]"
          aria-label="Ir a agendar cita"
        >
          Agendar cita
        </a>
      </div>
    </div>
  );
}
