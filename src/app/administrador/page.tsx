"use client";

import { useEffect, useState } from "react";

type Area = {
  id: string;
  slug: string;
  name: string;
  description: string;
  points: string[];
  icon: string;
  visible: boolean;
  sort_order: number;
};

type Abogado = {
  id: string;
  name: string;
  cedula: string;
  rol: string;
  bio: string;
  visible: boolean;
  sort_order: number;
};

type Settings = {
  brand_name: string;
  tagline: string;
  city: string;
  whatsapp_number: string;
  phone_display: string;
  whatsapp_message: string;
  email: string;
  address: string;
  hours: string;
  slogan: string;
  footer_text: string;
  maps_url: string;
};

type Metrics = { visits: number; likes: Record<string, number>; totalLikes: number };

const ICONS = ["balanza", "familia", "contrato", "escudo", "tierra", "negocio", "documento"];

export default function AdministradorPage() {
  const [checking, setChecking] = useState(true);
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [abogados, setAbogados] = useState<Abogado[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [tab, setTab] = useState<"resumen" | "areas" | "equipo" | "datos" | "fotos">("resumen");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editingAbogado, setEditingAbogado] = useState<Abogado | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => setLogged(r.ok))
      .catch(() => setLogged(false))
      .finally(() => setChecking(false));
  }, []);

  async function loadAll() {
    const r = await fetch("/api/admin/data");
    if (!r.ok) {
      setLogged(false);
      return;
    }
    const d = await r.json();
    setAreas((d.areas ?? []).sort((a: Area, b: Area) => a.sort_order - b.sort_order));
    setAbogados((d.abogados ?? []).sort((a: Abogado, b: Abogado) => a.sort_order - b.sort_order));
    setSettings(d.settings);
  }

  async function loadMetrics() {
    const r = await fetch("/api/admin/metrics");
    if (!r.ok) return;
    setMetrics(await r.json());
  }

  useEffect(() => {
    if (logged) {
      loadAll();
      loadMetrics();
    }
  }, [logged]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      setError(d.error ?? "No se pudo entrar");
      return;
    }
    setPassword("");
    setLogged(true);
  }

  async function logout() {
    await fetch("/api/admin/me", { method: "POST" });
    setLogged(false);
  }

  async function persist(nextAreas: Area[], nextAbogados: Abogado[], nextSettings: Settings | null) {
    const r = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ areas: nextAreas, abogados: nextAbogados, settings: nextSettings }),
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, data };
  }

  function applySaved(data: { areas?: Area[]; abogados?: Abogado[]; settings?: Settings }) {
    if (Array.isArray(data.areas)) setAreas([...data.areas].sort((a, b) => a.sort_order - b.sort_order));
    if (Array.isArray(data.abogados)) setAbogados([...data.abogados].sort((a, b) => a.sort_order - b.sort_order));
    if (data.settings) setSettings(data.settings);
  }

  async function saveAll(msg = "Guardado. La página se actualiza sola en 1-2 minutos.") {
    if (!settings) return;
    setSaving(true);
    setError("");
    setOk("");
    const { ok, data } = await persist(areas, abogados, settings);
    setSaving(false);
    if (!ok) {
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    applySaved(data);
    setOk(msg);
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError("");
    setOk("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "No se pudo subir");
      setOk(`Foto subida: ${d.path}. Aparece en la página en 1-2 minutos. Si es el logo, avise para colocarlo como principal.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  }

  if (checking)
    return (
      <Shell>
        <p className="p-10 text-center">Cargando…</p>
      </Shell>
    );

  if (!logged) {
    return (
      <Shell>
        <form
          onSubmit={login}
          className="mx-auto mt-14 max-w-sm rounded-4xl border border-navy-800/10 bg-white p-8 shadow-card"
        >
          <p className="text-center text-3xl">⚖️</p>
          <h1 className="mt-2 text-center font-serif text-2xl font-black text-navy-900">
            LEXUM · Administrador
          </h1>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-800/45">
            🔒 Acceso restringido
          </p>
          <label className="label mt-5">Usuario</label>
          <input
            className="field"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="lexum"
            autoComplete="username"
            required
          />
          <label className="label mt-4">Contraseña</label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />
          {error && <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}
          <button className="btn-primary mt-6 w-full">Entrar</button>
        </form>
        <a href="/" className="btn-ghost mx-auto mt-3 flex max-w-sm !py-3">
          ← Volver a la página
        </a>
      </Shell>
    );
  }

  const top = [...areas]
    .map((a) => ({ ...a, count: metrics ? Number(metrics.likes[a.slug] ?? 0) : 0 }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...top.map((a) => a.count));

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 text-white shadow-float md:p-7">
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-200">
                🔒 Modo administrador
              </p>
              <h1 className="mt-2.5 font-serif text-[24px] font-black leading-tight md:text-[28px]">
                Panel de control LEXUM
              </h1>
              <p className="mt-1 text-[13px] text-white/60">
                Funciona en computadora y celular. Los cambios se publican solos en 1-2 min.
              </p>
            </div>
            <button
              className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
              onClick={logout}
            >
              Salir
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["resumen", "📊 Resumen"],
              ["areas", "⚖️ Áreas"],
              ["equipo", "👥 Equipo"],
              ["datos", "⚙️ Datos"],
              ["fotos", "📷 Fotos"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setEditingArea(null);
                setEditingAbogado(null);
                setOk("");
                setError("");
                if (t === "resumen") loadMetrics();
              }}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold sm:px-5 ${tab === t ? "bg-navy-800 text-white" : "border border-navy-800/10 bg-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {ok && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">{ok}</p>}

        {tab === "resumen" && (
          <div className="mt-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="card-admin text-center">
                <p className="text-2xl">👀</p>
                <p className="mt-1 font-serif text-2xl font-black text-navy-900 sm:text-3xl">
                  {metrics ? metrics.visits.toLocaleString("es-MX") : "…"}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55">Visitas</p>
              </div>
              <div className="card-admin text-center">
                <p className="text-2xl">💬</p>
                <p className="mt-1 font-serif text-2xl font-black text-navy-900 sm:text-3xl">
                  {metrics ? metrics.totalLikes.toLocaleString("es-MX") : "…"}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55">Consultas</p>
              </div>
              <div className="card-admin text-center">
                <p className="text-2xl">⚖️</p>
                <p className="mt-1 font-serif text-2xl font-black text-navy-900 sm:text-3xl">
                  {areas.filter((a) => a.visible).length}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink/55">Áreas</p>
              </div>
            </div>

            <div className="card-admin mt-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-lg font-bold text-navy-900">Lo más consultado</h2>
                <button onClick={loadMetrics} className="rounded-full bg-navy-50 px-4 py-1.5 text-xs font-bold text-navy-800">
                  🔄 Actualizar
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {top.map((a) => (
                  <div key={a.id}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <p className="truncate font-semibold text-navy-900">{a.name}</p>
                      <p className="shrink-0 font-bold text-navy-800">💬 {a.count}</p>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-navy-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-400 to-navy-800 transition-all duration-700"
                        style={{ width: `${Math.round((a.count / maxCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink/55">
                👀 Visitas = veces que abrieron la página. 💬 Consultas = toques en “Consultar por WhatsApp” por área.
              </p>
            </div>
          </div>
        )}

        {tab === "areas" && !editingArea && (
          <div className="mt-5 space-y-3">
            {areas.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-3xl border border-navy-800/10 bg-white p-4 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-800 text-sm font-black text-gold-300">
                  {a.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy-900">{a.name}</p>
                  <p className="truncate text-xs text-ink/55">
                    {a.points.slice(0, 2).join(" · ")} · {a.visible ? "Visible" : "Oculta"}
                  </p>
                </div>
                <button onClick={() => setEditingArea({ ...a })} className="shrink-0 rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-white">
                  Editar
                </button>
              </div>
            ))}
            <p className="rounded-3xl border border-navy-800/10 bg-white p-4 text-[13px] leading-relaxed text-ink/60">
              Para agregar u ocultar un área, edite el nombre y marque visible/no visible. Las áreas nuevas se crean desde el código para no romper el diseño.
            </p>
          </div>
        )}

        {tab === "areas" && editingArea && (
          <div className="card-admin mt-5">
            <h2 className="font-serif text-xl font-bold text-navy-900">Editar área: {editingArea.name}</h2>
            <label className="label mt-4">Nombre</label>
            <input className="field" value={editingArea.name} onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })} />
            <label className="label mt-4">Descripción</label>
            <textarea className="field min-h-20" value={editingArea.description} onChange={(e) => setEditingArea({ ...editingArea, description: e.target.value })} />
            <label className="label mt-4">Puntos (uno por línea, máx 6)</label>
            <textarea
              className="field min-h-24"
              value={editingArea.points.join("\n")}
              onChange={(e) => setEditingArea({ ...editingArea, points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 6) })}
            />
            <label className="label mt-4">Icono</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setEditingArea({ ...editingArea, icon: ic })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${editingArea.icon === ic ? "bg-navy-800 text-white" : "border border-navy-800/15 bg-white"}`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <label className="mt-4 flex min-h-[48px] cursor-pointer items-center gap-3 rounded-2xl border border-navy-800/10 px-4">
              <input
                type="checkbox"
                checked={editingArea.visible}
                onChange={(e) => setEditingArea({ ...editingArea, visible: e.target.checked })}
                className="h-5 w-5 accent-[#0F2A44]"
              />
              <span className="text-sm font-semibold text-navy-900">Visible en la página</span>
            </label>
            <div className="mt-5 flex gap-3">
              <button
                disabled={saving}
                onClick={async () => {
                  const next = areas.map((a) => (a.id === editingArea.id ? editingArea : a));
                  setAreas(next);
                  setEditingArea(null);
                  setSaving(true);
                  setError("");
                  setOk("");
                  const { ok, data } = await persist(next, abogados, settings);
                  setSaving(false);
                  if (!ok) {
                    setError(data.error ?? "No se pudo guardar");
                    return;
                  }
                  applySaved(data);
                  setOk("Área guardada. Se publica en 1-2 minutos.");
                }}
                className="btn-primary flex-1 !py-3.5"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={() => setEditingArea(null)} className="btn-ghost">
                Atrás
              </button>
            </div>
          </div>
        )}

        {tab === "equipo" && !editingAbogado && (
          <div className="mt-5 space-y-3">
            {abogados.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-3xl border border-navy-800/10 bg-white p-4 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 font-serif text-sm font-black text-gold-300">
                  {b.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy-900">{b.name}</p>
                  <p className="truncate text-xs text-ink/55">Céd. {b.cedula} · {b.rol}</p>
                </div>
                <button onClick={() => setEditingAbogado({ ...b })} className="shrink-0 rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-white">
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "equipo" && editingAbogado && (
          <div className="card-admin mt-5">
            <h2 className="font-serif text-xl font-bold text-navy-900">Editar abogado</h2>
            <label className="label mt-4">Nombre completo</label>
            <input className="field" value={editingAbogado.name} onChange={(e) => setEditingAbogado({ ...editingAbogado, name: e.target.value })} />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Cédula Profesional Federal</label>
                <input className="field" value={editingAbogado.cedula} onChange={(e) => setEditingAbogado({ ...editingAbogado, cedula: e.target.value.replace(/\D/g, "") })} inputMode="numeric" />
              </div>
              <div>
                <label className="label">Rol</label>
                <input className="field" value={editingAbogado.rol} onChange={(e) => setEditingAbogado({ ...editingAbogado, rol: e.target.value })} />
              </div>
            </div>
            <label className="label mt-4">Presentación corta</label>
            <textarea className="field min-h-20" value={editingAbogado.bio} onChange={(e) => setEditingAbogado({ ...editingAbogado, bio: e.target.value })} maxLength={160} />
            <div className="mt-5 flex gap-3">
              <button
                disabled={saving}
                onClick={async () => {
                  const next = abogados.map((b) => (b.id === editingAbogado.id ? editingAbogado : b));
                  setAbogados(next);
                  setEditingAbogado(null);
                  setSaving(true);
                  setError("");
                  setOk("");
                  const { ok, data } = await persist(areas, next, settings);
                  setSaving(false);
                  if (!ok) {
                    setError(data.error ?? "No se pudo guardar");
                    return;
                  }
                  applySaved(data);
                  setOk("Equipo guardado. Se publica en 1-2 minutos.");
                }}
                className="btn-primary flex-1 !py-3.5"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={() => setEditingAbogado(null)} className="btn-ghost">
                Atrás
              </button>
            </div>
          </div>
        )}

        {tab === "datos" && settings && (
          <div className="card-admin mt-5">
            <h2 className="font-serif text-xl font-bold text-navy-900">Datos del despacho</h2>
            <label className="label mt-4">Número de WhatsApp (con código país, sin + ni espacios)</label>
            <input className="field" value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value.replace(/\D/g, "") })} inputMode="numeric" />
            <p className="hint">Ej: 523171342202</p>
            <label className="label mt-4">Teléfono visible</label>
            <input className="field" value={settings.phone_display} onChange={(e) => setSettings({ ...settings, phone_display: e.target.value })} />
            <label className="label mt-4">Mensaje inicial de WhatsApp</label>
            <textarea className="field min-h-20" value={settings.whatsapp_message} onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })} />
            <label className="label mt-4">Correo</label>
            <input className="field" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} inputMode="email" />
            <label className="label mt-4">Dirección</label>
            <input className="field" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            <label className="label mt-4">Horario</label>
            <input className="field" value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} />
            <label className="label mt-4">Lema</label>
            <input className="field" value={settings.slogan} onChange={(e) => setSettings({ ...settings, slogan: e.target.value })} />
            <label className="label mt-4">Enlace de Google Maps</label>
            <input className="field" value={settings.maps_url} onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })} />
            <button disabled={saving} onClick={() => saveAll()} className="btn-primary mt-5 w-full !py-3.5">
              {saving ? "Guardando…" : "Guardar datos"}
            </button>
          </div>
        )}

        {tab === "fotos" && (
          <div className="card-admin mt-5">
            <h2 className="font-serif text-xl font-bold text-navy-900">Fotos: logo y banner</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Suba aquí el logo LEXUM y la imagen azul de servicios desde el celular o la computadora.
              Quedan guardadas en el repositorio y la página las usa en 1-2 minutos.
            </p>
            <div className="mt-4 rounded-2xl bg-navy-50 p-4 text-[13px] leading-relaxed text-navy-800">
              <p className="font-bold">Nombres que usa la página automáticamente:</p>
              <p className="mt-1">• <code>/images/logo.jpg</code> → logotipo del menú</p>
              <p>• <code>/images/banner.jpg</code> → foto del hero</p>
              <p className="mt-2 text-navy-800/60">Si sube con otro nombre, avise para colocarlo como principal.</p>
            </div>
            <label className="mt-4 inline-flex min-h-[52px] cursor-pointer items-center gap-2 rounded-full bg-navy-800 px-6 text-[15px] font-bold text-white active:scale-[0.98]">
              {uploading ? "Subiendo…" : "📷 Subir foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                  e.target.value = "";
                }}
              />
            </label>
            <p className="hint">JPG o PNG, de preferencia menos de 3 MB. Funciona desde el celular.</p>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper font-sans text-ink">{children}</div>;
}
