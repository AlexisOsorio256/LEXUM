"use client";

import { buildWaLink, telLink } from "@/lib/whatsapp";

type Props = { waNumber: string; waMessage: string; phoneDisplay: string };

/**
 * Barra fija SOLO en móvil (md:hidden): Llamar + WhatsApp.
 * Botones de 56px, respeta safe-area. En escritorio se usa el flotante.
 */
export default function StickyCallBar({ waNumber, waMessage, phoneDisplay }: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-800/10 bg-white/95 px-3 pt-2 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={telLink(waNumber)}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-navy-800 text-[15px] font-bold text-white active:scale-[0.98]"
          aria-label={`Llamar al ${phoneDisplay}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
          </svg>
          Llamar
        </a>
        <a
          href={buildWaLink(waNumber, waMessage)}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-[15px] font-bold text-white active:scale-[0.98]"
          aria-label="Agendar por WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
