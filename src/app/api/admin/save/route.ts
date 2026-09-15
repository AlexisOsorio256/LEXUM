import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";
import { commitFile } from "@/lib/github";

const slugify = (s: string) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Guarda áreas + equipo + datos. Vercel lo publica solo en 1-2 min. */
export async function POST(req: Request) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entró" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const areas = Array.isArray(body?.areas) ? body.areas : null;
  const abogados = Array.isArray(body?.abogados) ? body.abogados : null;
  const settings = body?.settings;
  if (!areas || !abogados || !settings || typeof settings.whatsapp_number !== "string") {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const cleanAreas = areas
    .filter((a: Record<string, unknown>) => String(a.name ?? "").trim())
    .map((a: Record<string, unknown>, i: number) => ({
      id: String(a.id ?? slugify(String(a.name)) ?? `a${i}`),
      slug: String(a.slug ?? slugify(String(a.name)) ?? `a${i}`),
      name: String(a.name ?? ""),
      description: String(a.description ?? ""),
      points: Array.isArray(a.points) ? (a.points as unknown[]).map((x) => String(x)).filter(Boolean).slice(0, 6) : [],
      icon: String(a.icon ?? "balanza"),
      visible: a.visible !== false,
      sort_order: Number(a.sort_order ?? i),
    }));

  const cleanAbogados = abogados
    .filter((b: Record<string, unknown>) => String(b.name ?? "").trim())
    .map((b: Record<string, unknown>, i: number) => ({
      id: String(b.id ?? slugify(String(b.name)) ?? `b${i}`),
      name: String(b.name ?? ""),
      cedula: String(b.cedula ?? ""),
      rol: String(b.rol ?? ""),
      bio: String(b.bio ?? ""),
      visible: b.visible !== false,
      sort_order: Number(b.sort_order ?? i),
    }));

  const cleanedSettings = {
    brand_name: String(settings.brand_name ?? "LEXUM"),
    tagline: String(settings.tagline ?? "Despacho Jurídico"),
    city: String(settings.city ?? "Autlán de Navarro, Jalisco"),
    whatsapp_number: String(settings.whatsapp_number ?? "").replace(/\D/g, ""),
    phone_display: String(settings.phone_display ?? ""),
    whatsapp_message: String(settings.whatsapp_message ?? ""),
    email: String(settings.email ?? ""),
    address: String(settings.address ?? ""),
    hours: String(settings.hours ?? ""),
    slogan: String(settings.slogan ?? ""),
    footer_text: String(settings.footer_text ?? ""),
    maps_url: String(settings.maps_url ?? ""),
  };

  const file = JSON.stringify(
    { settings: cleanedSettings, areas: cleanAreas, abogados: cleanAbogados },
    null,
    2
  );

  try {
    await commitFile("src/data/despacho.json", file, "Actualizar LEXUM desde /administrador");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo guardar" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, areas: cleanAreas, abogados: cleanAbogados, settings: cleanedSettings });
}
