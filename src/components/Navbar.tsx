"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-navy-800/10 bg-white/95 shadow-card backdrop-blur-xl"
          : "border-b border-transparent bg-white/85 backdrop-blur-lg"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-center px-4 md:h-[84px] lg:px-8">
        <a href="#inicio" className="flex items-center gap-3.5" aria-label="LEXUM inicio">
          <Logo size={52} />
          <span className="flex flex-col justify-center leading-none">
            <span className="font-serif text-[26px] font-black tracking-wide text-navy-900 md:text-[28px]">
              LEX<span className="text-navy-600">UM</span>
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-500">
              Despacho Jurídico
            </span>
          </span>
        </a>
      </nav>
      {/* Administrador siempre en la esquina superior derecha */}
      <a
        href="/administrador"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-navy-800/10 bg-white/80 px-4 py-2 text-[13px] font-semibold text-navy-900/60 backdrop-blur transition hover:bg-white hover:text-navy-900 md:right-6 lg:flex"
      >
        🔒 Administrador
      </a>
      {/* En móvil, acceso discreto en la esquina también */}
      <a
        href="/administrador"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-white md:hidden"
        aria-label="Administrador"
      >
        🔒
      </a>
    </header>
  );
}
