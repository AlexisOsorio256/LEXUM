import despacho from "@/data/despacho.json";
import type { Abogado, Area, SiteSettings } from "@/lib/types";
import { getMetrics } from "@/lib/metrics";
import VisitTracker from "@/components/VisitTracker";
import Reveal from "@/components/Reveal";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Contacto from "@/components/Contacto";
import Areas from "@/components/Areas";
import Equipo from "@/components/Equipo";
import Agendar from "@/components/Agendar";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";

export const revalidate = 60;

/**
 * Orden: Inicio corto → Contacto → Áreas → Equipo → Agendar.
 * El visitante ve primero dónde comunicarse; cada dato una sola vez.
 * Único flujo hacia WhatsApp: el formulario de Agendar.
 */
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
      <Navbar waNumber={settings.whatsapp_number} phoneDisplay={settings.phone_display} />
      <Hero settings={settings} />
      <Contacto settings={settings} />
      <Areas areas={areas} consultas={metrics.likes} />
      <Equipo abogados={abogados} />
      <Agendar areas={areas} waNumber={settings.whatsapp_number} />
      <Footer settings={settings} />
      {/* espacio para que la barra fija móvil no tape el final */}
      <div aria-hidden className="h-[76px] bg-navy-950 md:hidden" />
      <StickyCallBar waNumber={settings.whatsapp_number} phoneDisplay={settings.phone_display} />
    </main>
  );
}
