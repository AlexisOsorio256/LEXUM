"use client";

import { useState } from "react";
import type { Area } from "@/lib/types";

export const AREA_EVENT = "lexum:elegir-area";

const ICONS: Record<string, JSX.Element> = {
  familia: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="8" cy="8" r="2.4" /><circle cx="16" cy="8" r="2.4" /><circle cx="12" cy="14" r="2.2" />
      <path d="M3.5 19c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4M11.5 19c.6-2.6 2.4-4 4.5-4" />
    </svg>
  ),
  contrato: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v5h5" /><path d="M9 12h7M9 15.5h7" />
    </svg>
  ),
  escudo: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9.5 12l2 2 3.5-4" />
    </svg>
  ),
  tierra: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M3 17c3-1 5.5 1 8 0s5 1 8 0" /><path d="M12 4v9" /><path d="M12 6c-3 0-4-1.5-4-1.5S9.5 3 12 3s4 1.5 4 1.5S15 6 12 6Z" />
    </svg>
  ),
  negocio: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <rect x="4" y="8" width="16" height="12" rx="1.5" /><path d="M4 9.5h16M9 4h6v4" />
    </svg>
  ),
  balanza: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M12 4v16M5 7h14M5 7l-2.5 6a2.8 2.8 0 0 0 5 0L5 7ZM19 7l-2.5 6a2.8 2.8 0 0 0 5 0L19 7ZM8 20h8" />
    </svg>
  ),
  documento: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <rect x="5" y="3" width="14" height="18" rx="1.5" /><circle cx="12" cy="10" r="2.4" /><path d="M9 16.5h6" />
    </svg>
  ),
};

type Props = {
  areas: Area[];
  consultas: Record<string, number>;
};

/** Áreas de práctica: 1 columna en celular, 2-3 en escritorio. "Consultar" lleva al formulario con el área elegida. */
export default function Areas({ areas, consultas }: Props) {
  const [counts, setCounts] = useState(consultas);

  async function contar(slug: string, areaName: string) {
    window.dispatchEvent(new CustomEvent(AREA_EVENT, { detail: areaName }));
    setCounts((c) => ({ ...c, [slug]: (c[slug] ?? 0) + 1 }));
    try {
      const r = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && typeof d.count === "number") {
        setCounts((c) => ({ ...c, [slug]: d.count }));
      }
    } catch {
      /* no romper */
    }
  }

  return (
    <section id="areas" className="relative overflow-hidden bg-paper">
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
        <p className="eyebrow mx-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          Áreas de práctica
        </p>
        <h2 className="mt-4 font-serif text-[clamp(1.8rem,5.5vw,2.8rem)] font-black leading-tight text-navy-900">
          ¿En qué te podemos ayudar?
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/65 md:text-base">
          Toca “Consultar” y el formulario se prepara con esa área.
          Sin llamadas incómodas, sin compromiso.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
        {areas.map((a, i) => (
          <article
            key={a.id}
            className="reveal card flex flex-col p-6"
            style={{ ["--reveal-delay" as string]: `${Math.min(i, 6) * 70}ms` }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-800 text-gold-300">
              {ICONS[a.icon] ?? ICONS.balanza}
            </span>
            <h3 className="mt-4 font-serif text-[21px] font-bold text-navy-900">{a.name}</h3>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/65">{a.description}</p>
            <ul className="mt-3 space-y-1.5">
              {a.points.slice(0, 3).map((p) => (
                <li key={p} className="flex items-start gap-2 text-[14px] text-ink/80">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="#agendar"
                onClick={() => contar(a.slug, a.name)}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-navy-800 px-5 text-[15px] font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-navy-700 active:translate-y-0 active:scale-[0.98]"
              >
                Consultar esta área
              </a>
            </div>
            {(counts[a.slug] ?? 0) > 0 && (
              <p className="mt-2 text-center text-xs text-ink/40">
                {counts[a.slug]} personas ya consultaron esta área
              </p>
            )}
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
