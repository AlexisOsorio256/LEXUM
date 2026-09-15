import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/adminAuth";
import despacho from "@/data/despacho.json";

export async function GET() {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "No entró" }, { status: 401 });
  }
  return NextResponse.json(despacho);
}
