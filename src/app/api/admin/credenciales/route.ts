import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifySession,
  COOKIE_NAME,
  checkLogin,
  currentUser,
  validateUser,
  validatePassword,
  hashPassword,
} from "@/lib/adminAuth";
import { commitFile } from "@/lib/github";
import adminData from "@/data/admin.json";

/**
 * Cambia usuario y/o contraseña del panel.
 * Exige las credenciales ACTUALES (la página es pública).
 * Se guarda el hash en el repo; Vercel lo publica solo en 1-2 min
 * y la sesión actual se cierra sola al publicarse.
 */
export async function POST(req: Request) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entró" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const curUser = String(body?.currentUser ?? "");
  const curPass = String(body?.currentPassword ?? "");
  const rawNewUser = String(body?.newUser ?? "").trim().toLowerCase();
  const newPass = String(body?.newPassword ?? "");

  if (!curUser || !curPass) {
    return NextResponse.json(
      { error: "Escriba su usuario y contraseña actuales para autorizar el cambio." },
      { status: 400 }
    );
  }
  if (!checkLogin(curUser, curPass)) {
    return NextResponse.json(
      { error: "Sus credenciales actuales no coinciden. Intente de nuevo." },
      { status: 403 }
    );
  }

  const wantUser = rawNewUser && rawNewUser !== currentUser();
  const wantPass = newPass.length > 0;

  if (!wantUser && !wantPass) {
    return NextResponse.json(
      { error: "No hay cambios: escriba un usuario o una contraseña nuevos." },
      { status: 400 }
    );
  }
  if (wantUser) {
    const err = validateUser(rawNewUser);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }
  if (wantPass) {
    const err = validatePassword(newPass);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  const prev = adminData as { user?: string; salt?: string; iterations?: number; hash?: string };
  const next = {
    user: wantUser ? rawNewUser : currentUser(),
    ...(wantPass
      ? hashPassword(newPass)
      : {
          salt: String(prev.salt ?? ""),
          iterations: Number(prev.iterations) || 210000,
          hash: String(prev.hash ?? ""),
        }),
  };

  if (!wantPass && (!next.salt || !next.hash)) {
    return NextResponse.json(
      { error: "Para este cambio primero debe definir una contraseña nueva." },
      { status: 400 }
    );
  }

  try {
    await commitFile(
      "src/data/admin.json",
      JSON.stringify(next, null, 2),
      "Actualizar credenciales del administrador"
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo guardar" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, user: next.user });
}
