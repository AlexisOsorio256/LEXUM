import type { SiteSettings } from "@/lib/types";
import { telLink, mailLink } from "@/lib/whatsapp";

type Props = { settings: SiteSettings };

/** Contacto: cada dato una sola vez (sin duplicar el hero). Incluye mapa y correo. */
export default function Contacto({ settings }: Props) {
  const rows = [
    {
      t: "Dirección",
      d: `${settings.address} · ${settings.city}`,
      href: settings.maps_url,
      label: "Cómo llegar",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
        </svg>
      ),
    },
    {
      t: "Teléfono / WhatsApp",
      d: settings.phone_display,
      href: telLink(settings.whatsapp_number),
      label: "Llamar ahora",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
        </svg>
      ),
    },
    {
      t: "Correo",
      d: settings.email,
      href: mailLink(settings.email),
      label: "Escribir",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      ),
    },
    {
      t: "Horario",
      d: settings.hours,
      href: "#agendar",
      label: "Agendar cita",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contacto" className="relative bg-navy-800 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,162,39,0.12)_0%,transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mx-auto !border-gold-400/40 !bg-white/10 !text-gold-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            Contacto
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,5.5vw,2.8rem)] font-black leading-tight">
            Visítanos o escríbenos hoy
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r, i) => (
            <div
              key={r.t}
              className="reveal rounded-4xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur"
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-400/15 text-gold-300">
                {r.icon}
              </span>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white/50">{r.t}</p>
              <p className="mt-1.5 break-words text-[15px] font-semibold leading-snug">{r.d}</p>
              <a
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel={r.href.startsWith("http") ? "noopener" : undefined}
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-gold-400/40 px-4 py-2 text-sm font-bold text-gold-200 transition hover:bg-gold-400/10 active:scale-95"
              >
                {r.label} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
