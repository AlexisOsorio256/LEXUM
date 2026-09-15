import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS } from "@/lib/site";

type Props = { settings: SiteSettings };

/** Cierre mínimo: marca, derechos y acceso Administrador. El contacto vive en su sección. */
export default function Footer({ settings }: Props) {
  return (
    <footer className="bg-navy-950 text-white/60">
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-8 text-center lg:px-8">
        <p className="font-serif text-xl font-black tracking-wide text-white">
          LEX<span className="text-gold-400">UM</span>
          <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-[0.24em] text-gold-400/70">
            {settings.tagline}
          </span>
        </p>
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] font-medium">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-gold-300">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="mt-4 text-xs text-white/35">
          © {new Date().getFullYear()} {settings.brand_name} · {settings.city} ·{" "}
          <a href="/administrador" className="transition hover:text-gold-300">
            🔒 Administrador
          </a>
        </p>
      </div>
    </footer>
  );
}
