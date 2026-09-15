"use client";

import { buildWaLink, telLink } from "@/lib/whatsapp";
import { BANNER_IMAGE } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

type Props = { settings: SiteSettings };

/**
 * Hero elegante abogado: azul marino + dorado, tipografía serif.
 * En móvil primero el mensaje y los botones (tap grande), luego la tarjeta.
 * Si colocas /public/images/banner.jpg se muestra la foto real;
 * si no, se ve un panel elegante en código (nunca roto).
 */
export default function Hero({ settings }: Props) {
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-900 pb-12 pt-24 text-white md:pb-20 md:pt-36">
      {/* fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute -top-24 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        {/* columnas sutiles */}
        <div className="absolute bottom-0 left-0 hidden w-40 opacity-[0.07] lg:block">
          <svg viewBox="0 0 100 300" className="h-auto w-full" fill="none" stroke="#fff" strokeWidth="3">
            <line x1="20" y1="30" x2="20" y2="270" />
            <line x1="50" y1="30" x2="50" y2="270" />
            <line x1="80" y1="30" x2="80" y2="270" />
            <rect x="8" y="12" width="84" height="14" />
            <rect x="8" y="274" width="84" height="14" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 hidden w-40 opacity-[0.07] lg:block">
          <svg viewBox="0 0 100 300" className="h-auto w-full" fill="none" stroke="#fff" strokeWidth="3">
            <line x1="20" y1="30" x2="20" y2="270" />
            <line x1="50" y1="30" x2="50" y2="270" />
            <line x1="80" y1="30" x2="80" y2="270" />
            <rect x="8" y="12" width="84" height="14" />
            <rect x="8" y="274" width="84" height="14" />
          </svg>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="text-center lg:text-left">
          <p className="hero-enter eyebrow mx-auto !border-gold-400/40 !bg-white/10 !text-gold-200 lg:mx-0">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            {settings.city}
          </p>
          <h1 className="hero-enter hero-enter-1 mt-5 font-serif text-[clamp(2.4rem,7.5vw,4.4rem)] font-black leading-[1.02]">
            Defendiendo tus derechos{" "}
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              con experiencia
            </span>{" "}
            y compromiso
          </h1>
          <p className="hero-enter hero-enter-2 mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/75 md:text-lg lg:mx-0">
            {settings.brand_name} · {settings.tagline}. Civil, Familiar, Agrario,
            Mercantil, Amparo, Notarial y Penal. Atención directa de abogados
            cedulados.
          </p>
          <div className="hero-enter hero-enter-3 mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={buildWaLink(settings.whatsapp_number, settings.whatsapp_message)}
              target="_blank"
              rel="noopener"
              className="btn-gold w-full sm:w-auto"
            >
              <WaIcon />
              Agendar por WhatsApp
            </a>
            <a href={telLink(settings.whatsapp_number)} className="w-full rounded-full border border-white/25 bg-white/10 px-7 py-4 text-center text-base font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[0.98] sm:w-auto">
              Llamar {settings.phone_display}
            </a>
          </div>
          <div className="hero-enter hero-enter-3 mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {["3 abogados cedulados", "7 áreas legales", "Cita por WhatsApp"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/80"
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </div>

        {/* Tarjeta lateral: foto real si existe, si no panel elegante */}
        <div className="hero-enter hero-enter-2 relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-[2rem] border border-gold-400/30 bg-white/[0.06] shadow-float backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BANNER_IMAGE}
              alt="Servicios jurídicos LEXUM"
              className="h-52 w-full object-cover md:h-64"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="px-6 pb-6 pt-7 md:px-8">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 shadow-gold">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                    <path d="M12 3v18" />
                    <path d="M5 6h14" />
                    <path d="M5 6l-2.5 6a2.8 2.8 0 0 0 5 0L5 6Z" />
                    <path d="M19 6l-2.5 6a2.8 2.8 0 0 0 5 0L19 6Z" />
                    <path d="M8 21h8" />
                    <circle cx="12" cy="4.5" r="1" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-300">
                    Servicios jurídicos
                  </p>
                  <p className="font-serif text-xl font-bold leading-tight">
                    {settings.slogan}
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-2 text-[14.5px] text-white/85 sm:grid-cols-2">
                {[
                  "Divorcios",
                  "Pensiones alimenticias",
                  "Custodia de menores",
                  "Contratos y asesoría",
                  "Juicios civiles y penales",
                  "Juicios agrarios",
                  "Trámites notariales",
                  "Juicio de amparo",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] px-3 py-2.5">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <a
                href={buildWaLink(settings.whatsapp_number, settings.whatsapp_message)}
                target="_blank"
                rel="noopener"
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-[15px] font-bold text-white transition hover:brightness-105 active:scale-[0.98]"
              >
                <WaIcon /> ({settings.phone_display.replace(" ", ") ").replace(/^/, "(")}
              </a>
            </div>
          </div>
          <p className="mt-3 text-center text-[12px] text-white/50 lg:text-left">
            Atención en {settings.city} · {settings.hours}
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
