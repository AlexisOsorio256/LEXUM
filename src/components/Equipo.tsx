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
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Tu equipo legal
          </p>
          <h2 className="mt-4 font-serif text-[clamp(1.8rem,5.5vw,2.8rem)] font-black leading-tight text-navy-900">
            Abogados cedulados, trato directo
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/65 md:text-base">
            Sin intermediarios: hablas directamente con quien llevará tu caso.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3">
          {abogados.map((b, i) => (
            <article
              key={b.id}
              className="reveal card overflow-hidden"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <div className="bg-gradient-to-br from-navy-800 to-navy-950 px-6 pb-6 pt-7 text-center text-white">
                <span className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full border-2 border-gold-400/70 bg-white/10 font-serif text-2xl font-black text-gold-200">
                  {initials(b.name)}
                </span>
                <h3 className="mt-4 font-serif text-[19px] font-bold leading-snug">{b.name}</h3>
                {b.rol.trim() ? (
                  <p className="mt-1 text-[12.5px] font-bold uppercase tracking-[0.16em] text-gold-300">
                    {b.rol}
                  </p>
                ) : null}
              </div>
              <div className="px-6 py-5">
                <p className="rounded-2xl bg-navy-50 px-4 py-2.5 text-center text-[13px] font-semibold text-navy-800">
                  Céd. Prof. Fed. {b.cedula}
                </p>
                <p className="mt-3 text-center text-[14px] leading-relaxed text-ink/65">{b.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
