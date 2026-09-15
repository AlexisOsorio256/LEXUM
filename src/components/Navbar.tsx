"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { telLink } from "@/lib/whatsapp";
import Logo from "./Logo";

type Props = {
  waNumber: string;
  phoneDisplay: string;
};

export default function Navbar({ waNumber, phoneDisplay }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-navy-800/10 bg-white/90 shadow-card backdrop-blur-xl"
          : "border-b border-transparent bg-white/70 backdrop-blur-lg"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[76px] lg:px-8">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="LEXUM inicio">
          <Logo size={44} />
          <span className="leading-tight">
            <span className="block font-serif text-[20px] font-black tracking-wide text-navy-900">
              LEX<span className="text-navy-600">UM</span>
            </span>
            <span className="block text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-500">
              Despacho Jurídico
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link text-[14.5px] font-medium text-navy-900/75 transition hover:text-navy-800"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/administrador"
            className="text-[13px] font-medium text-navy-900/40 transition hover:text-navy-800"
            title="Acceso administrador"
          >
            🔒 Administrador
          </a>
          <a
            href="#agendar"
            className="rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-navy-700 active:scale-95"
          >
            Agendar cita
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={telLink(waNumber)}
            aria-label={`Llamar ${phoneDisplay}`}
            className="grid h-11 w-11 place-items-center rounded-full bg-navy-800 text-white shadow-card active:scale-95"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
            </svg>
          </a>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-navy-800/15 bg-white/80 backdrop-blur-xl"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full rounded bg-navy-900 transition-all ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-navy-900 transition-all ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full rounded bg-navy-900 transition-all ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-navy-800/10 bg-white/95 px-4 pb-10 pt-3 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3.5 font-serif text-[22px] font-bold text-navy-900 transition hover:bg-navy-50"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/administrador"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-[14px] font-medium text-navy-900/45"
            >
              🔒 Administrador
            </a>
            <div className="mt-4">
              <a href={telLink(waNumber)} className="btn-primary w-full !px-4 text-[15px]">
                Llamar {phoneDisplay}
              </a>
            </div>
            <p className="mt-3 text-center text-xs text-navy-900/50">
              {phoneDisplay} · Autlán de Navarro
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
