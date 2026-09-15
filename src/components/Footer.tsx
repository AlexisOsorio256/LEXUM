import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS } from "@/lib/site";

type Props = { settings: SiteSettings };

/** Cierre sobrio. El acceso Administrador vive aquí y en el menú superior. */
export default function Footer({ settings }: Props) {
  return (
    <footer className="bg-navy-950 text-white/70">
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-serif text-2xl font-black tracking-wide text-white">
              LEX<span className="text-gold-400">UM</span>
            </p>
            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.22em] text-gold-400/80">
              {settings.tagline}
            </p>
            <p className="mt-2 text-[13px]">{settings.footer_text}</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] font-medium">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-gold-300">
                {l.label}
              </a>
            ))}
            <a href="/administrador" className="text-white/35 transition hover:text-gold-300">
              🔒 Administrador
            </a>
          </nav>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs leading-relaxed text-white/40">
          <p>
            © {new Date().getFullYear()} {settings.brand_name} {settings.tagline} · {settings.city}
          </p>
          <p className="mt-1">{settings.address} · {settings.phone_display} · {settings.email}</p>
        </div>
      </div>
    </footer>
  );
}
