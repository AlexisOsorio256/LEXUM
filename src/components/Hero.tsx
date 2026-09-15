"use client";

import type { SiteSettings } from "@/lib/types";

type Props = { settings: SiteSettings };

/**
 * Hero sobrio sin foto: azul marino elegante construido en código,
 * un solo mensaje, dos acciones. El detalle vive en su sección.
 */
export default function Hero({ settings }: Props) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,#1E4A7A_0%,#0A1A2F_62%,#060F1D_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[280px] w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="absolute bottom-8 left-[5%] hidden opacity-30 lg:block">
          <ScaleMark />
        </div>
        <div className="absolute bottom-8 right-[5%] hidden opacity-30 lg:block">
          <ScaleMark />
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-24 md:pb-16 md:pt-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="hero-enter inline-flex items-center gap-2.5 rounded-full border border-gold-400/50 bg-gold-400/10 px-5 py-2 text-[11.5px] font-bold uppercase tracking-[0.22em] text-gold-200 shadow-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {settings.city}
          </p>
          <h1 className="hero-enter hero-enter-1 mt-6 font-serif text-[clamp(2.6rem,8vw,4.6rem)] font-black leading-[1.02] drop-shadow-lg">
            Defendiendo tus derechos{" "}
            <em className="gold-shimmer">
              con experiencia
            </em>{" "}
            y compromiso
          </h1>
          <div aria-hidden className="hero-enter hero-enter-2 mt-6 h-[2px] w-24 rounded bg-gradient-to-r from-gold-400 to-transparent" />
          <p className="hero-enter hero-enter-2 mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/85 md:text-lg">
            {settings.brand_name} · {settings.tagline}. Atención directa de
            abogados cedulados en materia Civil, Familiar, Penal, Agraria,
            Mercantil, Amparo y Notarial.
          </p>
          <div className="hero-enter hero-enter-3 mt-8">
            <a href="#agendar" className="btn-gold w-full sm:w-auto">
              Agendar cita
            </a>
          </div>
          <p className="hero-enter hero-enter-3 mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-white/65">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {settings.hours}
          </p>
        </div>
      </div>
    </section>
  );
}

function ScaleMark() {
  return (
    <svg width="120" height="160" viewBox="0 0 24 32" fill="none" stroke="#C9A227" strokeWidth="0.8" strokeLinecap="round" aria-hidden>
      <path d="M12 3v24M5 7h14M5 7l-2.5 6a2.8 2.8 0 0 0 5 0L5 7ZM19 7l-2.5 6a2.8 2.8 0 0 0 5 0L19 7ZM8 27h8" />
      <circle cx="12" cy="4.5" r="0.9" fill="#C9A227" />
    </svg>
  );
}
