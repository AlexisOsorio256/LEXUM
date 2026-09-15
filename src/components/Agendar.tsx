"use client";

import { useState } from "react";
import type { Area } from "@/lib/types";
import { citaLink } from "@/lib/whatsapp";

type Props = {
  areas: Area[];
  waNumber: string;
};

export default function Agendar({ areas, waNumber }: Props) {
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function agendar(e: React.FormEvent) {
    e.preventDefault();
    if (nombre.trim().length < 2) {
      setError("Escribe tu nombre para poder atenderte mejor.");
      return;
    }
    if (!area) {
      setError("Elige el área de tu caso.");
      return;
    }
    setError("");
    const url = citaLink({ nombre, area, mensaje }, waNumber);
    window.open(url, "_blank", "noopener");
  }

  return (
    <section id="agendar" className="mx-auto max-w-6xl px-4 py-14 md:py-20 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="reveal">
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Agendar cita
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,5.5vw,2.8rem)] font-black leading-tight text-navy-900">
            Agenda en menos de 1 minuto
          </h2>
          <ol className="mt-6 space-y-4">
            {[
              ["1", "Cuéntanos tu caso", "Escribe tu nombre, el área y un resumen corto."],
              ["2", "Te abrimos WhatsApp", "El mensaje llega listo al 317 134 2202. Solo le das enviar."],
              ["3", "Confirmamos tu cita", "Te respondemos con fecha, hora y lo que debes llevar."],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-800 font-serif text-lg font-black text-gold-300">
                  {n}
                </span>
                <span>
                  <span className="block font-bold text-navy-900">{t}</span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-ink/60">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={agendar} className="reveal card p-6 md:p-8" style={{ ["--reveal-delay" as string]: "120ms" }}>
          <h3 className="font-serif text-[22px] font-bold text-navy-900">Solicitar cita por WhatsApp</h3>
          <p className="mt-1 text-[13.5px] text-ink/55">Respuesta en horario de oficina. Sin costo por preguntar.</p>

          <label className="label mt-5" htmlFor="cita-nombre">Tu nombre</label>
          <input
            id="cita-nombre"
            className="field"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: María López"
            autoComplete="name"
            maxLength={60}
          />

          <label className="label mt-4" htmlFor="cita-area">Área de tu caso</label>
          <select
            id="cita-area"
            className="field"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="">— Elige una opción —</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
            <option value="Otro asunto">Otro asunto</option>
          </select>

          <label className="label mt-4" htmlFor="cita-msg">Cuéntanos en 1-2 líneas (opcional)</label>
          <textarea
            id="cita-msg"
            className="field min-h-[96px]"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Ej: Quiero iniciar mi divorcio y tengo 2 hijos menores."
            maxLength={500}
          />

          {error && (
            <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
          )}

          <button type="submit" className="btn-wa mt-5 w-full !py-4 text-[16px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.6 1.1 1.4 1.8 2.5 2.4.3.1.5 0 .7-.2l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3 0 .2 0 .7-.6 1.8Z" />
            </svg>
            Enviar y agendar
          </button>
          <p className="hint text-center">Al tocar se abre WhatsApp con tu mensaje listo. Tú decides enviarlo.</p>
        </form>
      </div>
    </section>
  );
}
