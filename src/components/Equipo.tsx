import type { Abogado } from "@/lib/types";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

/** Equipo: tarjetas sobrias con cédula profesional visible (genera confianza). */
export default function Equipo({ abogados }: { abogados: Abogado[] }) {
  return (
    <section id="equipo" className="border-y border-navy-800/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 lg:px-8">
        <h2 className="reveal text-center font-serif text-[clamp(2rem,6vw,2.9rem)] font-black leading-tight text-navy-900">
          Tu equipo
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3">
          {abogados.map((b, i) => (
            <article
              key={b.id}
              className="reveal card flex flex-col overflow-hidden"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <div className="bg-gradient-to-br from-navy-800 to-navy-950 px-6 pb-6 pt-7 text-center text-white">
                <span className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full border-2 border-gold-400/70 bg-white/10 font-serif text-2xl font-black text-gold-200">
                  {initials(b.name)}
                </span>
                <h3 className="mt-4 font-serif text-[19px] font-bold leading-snug">{b.name}</h3>
                <p className="mt-1.5 min-h-[18px] text-[12.5px] font-bold uppercase tracking-[0.16em] text-gold-300">
                  {b.rol || "\u00A0"}
                </p>
              </div>
              <div className="flex flex-1 flex-col px-6 py-5">
                <p className="rounded-2xl bg-navy-50 px-4 py-2.5 text-center text-[13px] font-semibold text-navy-800">
                  Céd. Prof. Fed. {b.cedula}
                </p>
                <p className="mt-3 flex-1 text-center text-[14px] leading-relaxed text-ink/65">{b.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
