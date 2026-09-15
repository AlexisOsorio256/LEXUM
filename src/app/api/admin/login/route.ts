import { NextResponse } from "next/server";
import { loginUser, createSession, COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { user, password } = await req.json().catch(() => ({}));
  const canonical = loginUser(String(user ?? ""), String(password ?? ""));
  if (!canonical) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos." },
      { status: 401 }
    );
  }
  const session = createSession(canonical);
  const res = NextResponse.json({ ok: true, user: canonical });
  res.cookies.set(COOKIE_NAME, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expires,
  });
  return res;
}
