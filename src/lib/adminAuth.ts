import { createHmac, timingSafeEqual, pbkdf2Sync, randomBytes } from "crypto";
import adminData from "@/data/admin.json";

const COOKIE = "lexum_admin";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const ITERATIONS = 210000;

export const COOKIE_NAME = COOKIE;
/** Usuario inicial (también respaldo si el archivo de credenciales falta). */
export const LEGACY_USER = "admin2026@";

export type AdminRecord = {
  user: string;
  salt: string;
  iterations: number;
  hash: string;
};

/**
 * Credenciales vigentes: viven en src/data/admin.json (solo hash, nunca
 * la contraseña) y se publican solas vía GitHub → Vercel en 1-2 min.
 * Si el archivo falta, se usa ADMIN_PASSWORD de Vercel como respaldo.
 */
function record(): AdminRecord | null {
  try {
    const r = adminData as Partial<AdminRecord>;
    if (
      r &&
      typeof r.user === "string" &&
      r.user.trim() &&
      typeof r.salt === "string" &&
      r.salt &&
      typeof r.hash === "string" &&
      r.hash
    ) {
      return {
        user: r.user.trim().toLowerCase(),
        salt: r.salt,
        iterations: Number(r.iterations) > 0 ? Number(r.iterations) : ITERATIONS,
        hash: r.hash,
      };
    }
  } catch {
    /* sin registro: modo respaldo */
  }
  return null;
}

/** Usuario actual del panel (para mostrarlo en la interfaz). */
export function currentUser(): string {
  return record()?.user ?? LEGACY_USER;
}

function secret(): string {
  const r = record();
  // Firmar con el hash vigente invalida sesiones viejas al cambiar credenciales.
  if (r) return `lexum:${r.user}:${r.hash}`;
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD no configurado");
  return `lexum:env:${s}`;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("hex");
}

/** Genera sal + hash PBKDF2 para guardar (nunca texto plano). */
export function hashPassword(password: string): { salt: string; iterations: number; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256").toString("hex");
  return { salt, iterations: ITERATIONS, hash };
}

function verifyHash(password: string, rec: AdminRecord): boolean {
  try {
    const h = pbkdf2Sync(password, rec.salt, rec.iterations, 32, "sha256").toString("hex");
    const a = Buffer.from(h);
    const b = Buffer.from(rec.hash);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Normaliza y valida el nombre de usuario. Devuelve error o "". */
export function validateUser(user: string): string {
  const u = user.trim().toLowerCase();
  if (u.length < 3 || u.length > 40) return "El usuario debe tener entre 3 y 40 caracteres.";
  if (!/^[a-z0-9@._-]+$/.test(u)) return "El usuario solo admite letras, números y @ . _ -";
  return "";
}

/** Valida la contraseña nueva. Devuelve error o "". */
export function validatePassword(password: string): string {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (password.length > 100) return "La contraseña es demasiado larga (máx. 100).";
  return "";
}

/**
 * Verifica usuario + contraseña del login.
 * Devuelve el usuario canónico si es correcto, o null.
 */
export function loginUser(user: string, password: string): string | null {
  try {
    const u = String(user ?? "").trim().toLowerCase();
    const r = record();
    if (r) {
      if (u === r.user && verifyHash(String(password ?? ""), r)) return r.user;
      return null;
    }
    if (u === LEGACY_USER && String(password ?? "") === process.env.ADMIN_PASSWORD) return LEGACY_USER;
    return null;
  } catch {
    return null;
  }
}

/** Verifica usuario + contraseña (booleano, para compatibilidad). */
export function checkLogin(user: string, password: string): boolean {
  return loginUser(user, password) !== null;
}

/** Crea el valor de la cookie de sesión (válida 7 días). */
export function createSession(username: string): { value: string; expires: Date } {
  const exp = Date.now() + SEVEN_DAYS;
  const data = `${username}.${exp}`;
  return { value: `${data}.${sign(data)}`, expires: new Date(exp) };
}

/** Verifica la cookie de sesión contra el usuario vigente. */
export function verifySession(raw: string | undefined): boolean {
  try {
    if (!raw) return false;
    const [user, exp, sig] = raw.split(".");
    if (!user || user.toLowerCase() !== currentUser() || !exp || !sig) return false;
    if (Number(exp) < Date.now()) return false;
    const expected = sign(`${user}.${exp}`);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
