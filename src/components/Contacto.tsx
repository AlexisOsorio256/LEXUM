import type { SiteSettings } from "@/lib/types";
import { telLink, mailLink } from "@/lib/whatsapp";

type Props = { settings: SiteSettings };

/**
 * Contacto ultra compacto: una franja elegante que no roba espacio.
 * Teléfono primero, luego dirección, horario y correo en línea.
 * Cada dato con su acción mínima (llamar, mapa, agendar, escribir).
 */
export default function Contacto({ settings }: Props) {
  return (
    <section id="contacto" className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_35%_at_50%_0%,rgba(201,162,39,0.12)_0%,transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-7 md:py-8 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
            <h2 className="font-serif text-[18px] font-black tracking-wide md:text-[19px]">Contacto</h2>
            <span aria-hidden className="hidden h-3.5 w-px bg-white/20 md:block" />
            <p className="text-[13px] font-medium text-white/60 md:text-[14px]">{settings.city}</p>
          </div>
          <ul className="flex flex-col gap-2 text-[14px] leading-snug md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-gold-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>
              </span>
              <a href={telLink(settings.whatsapp_number)} className="font-semibold underline decoration-white/20 underline-offset-4 hover:decoration-gold-400">{settings.phone_display}</a>
              <span className="text-white/35">·</span>
              <a href={telLink(settings.whatsapp_number)} className="text-xs font-bold uppercase tracking-wide text-gold-300 hover:text-gold-200">Llamar</a>
            </li>
            <li className="hidden text-white/20 md:block">·</li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-gold-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>
              </span>
              <span className="text-white/85">{settings.address}</span>
              <a href={settings.maps_url} target="_blank" rel="noopener" className="text-xs font-bold uppercase tracking-wide text-gold-300 hover:text-gold-200">Mapa →</a>
            </li>
            <li className="hidden text-white/20 md:block">·</li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-gold-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2" strokeLinecap="round"/></svg>
              </span>
              <span className="text-white/85">{settings.hours}</span>
              <a href="#agendar" className="text-xs font-bold uppercase tracking-wide text-gold-300 hover:text-gold-200">Agendar →</a>
            </li>
            <li className="hidden text-white/20 md:block">·</li>
            <li className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-gold-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
              </span>
              <a href={mailLink(settings.email)} className="break-all text-white/85 underline decoration-white/20 underline-offset-4 hover:decoration-gold-400">{settings.email}</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
