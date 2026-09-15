"use client";

import { buildWaLink, telLink } from "@/lib/whatsapp";
import { BANNER_IMAGE } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

type Props = { settings: SiteSettings };

/**
 * Hero minimalista: foto real de fondo con velo azul marino,
 * un solo mensaje, dos acciones. El detalle de servicios vive
 * únicamente en la sección Áreas (sin duplicar).
 */
export default function Hero({ settings }: Props) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-950 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BANNER_IMAGE}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-900/80 to-navy-950/95" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 md:pb-24 md:pt-40 lg:px-8">
        <div className="max-w-2xl">
          <p className="hero-enter eyebrow !border-gold-400/40 !bg-white/10 !text-gold-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {settings.city}
          </p>
          <h1 className="hero-enter hero-enter-1 mt-5 font-serif text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-[1.02]">
            Defendiendo tus derechos{" "}
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              con experiencia
            </span>{" "}
            y compromiso
          </h1>
          <p className="hero-enter hero-enter-2 mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/80 md:text-lg">
            {settings.brand_name} · {settings.tagline}. Atención directa de
            abogados cedulados en materia Civil, Familiar, Penal, Agraria,
            Mercantil, Amparo y Notarial.
          </p>
          <div className="hero-enter hero-enter-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildWaLink(settings.whatsapp_number, settings.whatsapp_message)}
              target="_blank"
              rel="noopener"
              className="btn-gold w-full sm:w-auto"
            >
              <WaIcon />
              Agendar por WhatsApp
            </a>
            <a
              href={telLink(settings.whatsapp_number)}
              className="w-full rounded-full border border-white/25 bg-white/10 px-7 py-4 text-center text-base font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[0.98] sm:w-auto"
            >
              {settings.phone_display}
            </a>
          </div>
          <p className="hero-enter hero-enter-3 mt-6 text-[13px] font-medium tracking-wide text-white/55">
            {settings.hours}
          </p>
        </div>
      </div>
    </section>
  );
}

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
    </svg>
  );
}
