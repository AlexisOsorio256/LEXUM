import type { SiteSettings } from "./types";

/**
 * ÚNICO lugar de valores por defecto. El panel /administrador
 * puede sobreescribirlos (se guardan en src/data/despacho.json
 * y Vercel republica solo en 1-2 min).
 * Número en formato internacional sin "+" ni espacios. Ej: 52 + 3171342202.
 */
export const SITE_DEFAULTS: SiteSettings = {
  brand_name: "LEXUM",
  tagline: "Despacho Jurídico",
  city: "Autlán de Navarro, Jalisco",
  whatsapp_number: "523171342202",
  phone_display: "317 134 2202",
  whatsapp_message: "Hola LEXUM, quiero agendar una cita. ¿Me pueden ayudar?",
  email: "lexum.abogados2026@gmail.com",
  address: "Calle 20 de Noviembre número 28, Colonia Centro",
  hours: "Lunes a Viernes · 9:00 am – 6:00 pm",
  slogan: "Defendiendo tus derechos con experiencia y compromiso",
  footer_text: "Despacho Jurídico · Autlán de Navarro, Jalisco",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=20+de+Noviembre+28+Centro+Autl%C3%A1n+de+Navarro+Jalisco",
};

/** Usuario del panel /administrador (la contraseña vive en ADMIN_PASSWORD, solo servidor). */
export const ADMIN_USER = "lexum";

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#areas", label: "Áreas" },
  { href: "#equipo", label: "Equipo" },
  { href: "#agendar", label: "Agendar" },
  { href: "#contacto", label: "Contacto" },
];

/**
 * Logo y banner: coloca tus archivos en public/images/ con estos nombres
 * y se usarán automáticamente. Si aún no están, el sitio muestra
 * una versión elegante recreada en código (sin romperse).
 */
export const LOGO_IMAGE = "/images/logo.jpg";
export const BANNER_IMAGE = "/images/banner.jpg";
