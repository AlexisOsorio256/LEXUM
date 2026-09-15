"use client";

import { LOGO_IMAGE } from "@/lib/site";

/**
 * Logotipo LEXUM: usa /public/images/logo.jpg cuando exista
 * (coloca ahí el archivo que vas a pasar). Mientras tanto muestra
 * una versión elegante recreada en SVG con los mismos colores
 * (azul + gris + balanza) para que la página nunca se vea rota.
 */
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <span className="relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-navy-800/10" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_IMAGE}
        alt="LEXUM"
        width={size}
        height={size}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Respaldo SVG: columnas + balanza + LEXUM */}
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="absolute inset-0 h-full w-full bg-white">
        <rect x="14" y="6" width="18" height="40" fill="#1E4A7A" />
        <rect x="32" y="12" width="18" height="40" fill="#8A8D91" />
        <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round">
          <line x1="32" y1="18" x2="32" y2="38" />
          <line x1="22" y1="22" x2="42" y2="22" />
          <line x1="22" y1="22" x2="18" y2="32" />
          <line x1="22" y1="22" x2="26" y2="32" />
          <line x1="42" y1="22" x2="38" y2="32" />
          <line x1="42" y1="22" x2="46" y2="32" />
          <line x1="18" y1="32" x2="26" y2="32" />
          <line x1="38" y1="32" x2="46" y2="32" />
          <line x1="24" y1="40" x2="40" y2="40" />
          <line x1="22" y1="42" x2="42" y2="42" />
        </g>
        <circle cx="32" cy="16" r="2.4" fill="#fff" />
        <text x="32" y="58" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="Georgia, serif" letterSpacing="1">
          <tspan fill="#4A4A4A">LEX</tspan>
          <tspan fill="#1E4A7A">UM</tspan>
        </text>
      </svg>
    </span>
  );
}
