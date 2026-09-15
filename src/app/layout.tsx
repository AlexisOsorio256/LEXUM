import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEXUM · Despacho Jurídico en Autlán de Navarro",
  description:
    "LEXUM Despacho Jurídico en Autlán de Navarro, Jalisco. Civil, Familiar, Agrario, Mercantil, Amparo, Notarial y Penal. Agenda tu cita por WhatsApp: 317 134 2202.",
  keywords: ["abogados Autlán", "despacho jurídico", "LEXUM", "divorcios", "pensiones alimenticias", "juicios", "amparo"],
  openGraph: {
    title: "LEXUM · Despacho Jurídico",
    description:
      "Defendiendo tus derechos con experiencia y compromiso. Civil, Familiar, Penal, Agrario, Mercantil, Amparo y Notarial. Agenda por WhatsApp.",
    type: "website",
    locale: "es_MX",
  },
  icons: { icon: "/images/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#0A1A2F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable} font-sans`}>{children}</body>
    </html>
  );
}
