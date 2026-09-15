import despacho from "@/data/despacho.json";
import type { Abogado, Area, SiteSettings } from "@/lib/types";
import { getMetrics } from "@/lib/metrics";
import VisitTracker from "@/components/VisitTracker";
import Reveal from "@/components/Reveal";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Areas from "@/components/Areas";
import Equipo from "@/components/Equipo";
import Agendar from "@/components/Agendar";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import StickyCallBar from "@/components/StickyCallBar";

export const revalidate = 60;

export default async function Home() {
  const settings = despacho.settings as SiteSettings;
  const areas = (despacho.areas as Area[])
    .filter((a) => a.visible)
    .sort((a, b) => a.sort_order - b.sort_order);
  const abogados = (despacho.abogados as Abogado[])
    .filter((b) => b.visible)
    .sort((a, b) => a.sort_order - b.sort_order);
  const metrics = await getMetrics();

  return (
    <main>
      <VisitTracker />
      <Reveal />
      <Navbar
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
        phoneDisplay={settings.phone_display}
      />
      <Hero settings={settings} />

      {/* Cinta de confianza: cédulas visibles sin duplicar equipo */}
      <div className="border-b border-navy-800/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center md:flex-row md:justify-center md:gap-8 lg:px-8">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-navy-800/50">
            Respaldo profesional
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13.5px] font-semibold text-navy-900/75">
            {abogados.map((b) => (
              <span key={b.id}>
                {b.name} · Céd. {b.cedula}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Areas areas={areas} waNumber={settings.whatsapp_number} consultas={metrics.likes} />
      <Equipo abogados={abogados} />
      <Agendar
        areas={areas}
        waNumber={settings.whatsapp_number}
        email={settings.email}
        phoneDisplay={settings.phone_display}
      />
      <Contacto settings={settings} />
      <Footer settings={settings} />
      {/* espacio para que la barra fija móvil no tape el final */}
      <div aria-hidden className="h-[76px] bg-navy-950 md:hidden" />
      <StickyCallBar
        waNumber={settings.whatsapp_number}
        waMessage={settings.whatsapp_message}
        phoneDisplay={settings.phone_display}
      />
      <WhatsAppFloat waNumber={settings.whatsapp_number} waMessage={settings.whatsapp_message} />
    </main>
  );
}
