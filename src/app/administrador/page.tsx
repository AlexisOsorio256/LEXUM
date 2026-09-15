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

const ICONS = ["balanza"] as const;

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
  const [tab, setTab] = useState<"resumen" | "areas" | "equipo" | "seguridad">("resumen");
  const [saving, setSaving] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [showNewArea, setShowNewArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaDesc, setNewAreaDesc] = useState("");
  const [newAreaPoints, setNewAreaPoints] = useState("");
  const [editingAbogado, setEditingAbogado] = useState<Abogado | null>(null);
  const [showNewAbogado, setShowNewAbogado] = useState(false);
  const [newAbName, setNewAbName] = useState("");
  const [newAbCedula, setNewAbCedula] = useState("");
  const [newAbRol, setNewAbRol] = useState("Abogado · Socio");
  const [newAbBio, setNewAbBio] = useState("");
  const [meUser, setMeUser] = useState("");
  const [secCurUser, setSecCurUser] = useState("");
  const [secCurPass, setSecCurPass] = useState("");
  const [secNewUser, setSecNewUser] = useState("");
  const [secNewPass, setSecNewPass] = useState("");
  const [secConfirm, setSecConfirm] = useState("");
  const [secShowCur, setSecShowCur] = useState(false);
  const [secShowNew, setSecShowNew] = useState(false);
  const [secSaving, setSecSaving] = useState(false);
  const [secDone, setSecDone] = useState("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then(async (r) => {
        setLogged(r.ok);
        if (r.ok) {
          const d = await r.json().catch(() => ({}));
          if (d.user) setMeUser(String(d.user));
        }
      })
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
    if (d.user) setMeUser(String(d.user));
  }

  async function logout() {
    await fetch("/api/admin/me", { method: "POST" });
    setLogged(false);
  }

  async function changeCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    setSecDone("");
    if (!secCurUser.trim() || !secCurPass) {
      setError("Escriba su usuario y contraseña actuales para autorizar el cambio.");
      return;
    }
    if (secNewPass && secNewPass !== secConfirm) {
      setError("La contraseña nueva y su confirmación no coinciden.");
      return;
    }
    setSecSaving(true);
    const r = await fetch("/api/admin/credenciales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUser: secCurUser,
        currentPassword: secCurPass,
        newUser: secNewUser,
        newPassword: secNewPass,
      }),
    });
    const d = await r.json().catch(() => ({}));
    setSecSaving(false);
    if (!r.ok) {
      setError(d.error ?? "No se pudo actualizar.");
      return;
    }
    setSecDone(
      `Credenciales actualizadas. La página las activa solas en 1-2 minutos. Después vuelva a entrar con su ${secNewPass ? "nueva contraseña" : "nuevo usuario"}.`
    );
    setSecCurPass("");
    setSecNewPass("");
    setSecConfirm("");
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

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  async function toggleAreaVisible(a: Area) {
    const next = areas.map((x) => (x.id === a.id ? { ...x, visible: !x.visible } : x));
    setAreas(next);
    setError("");
    setOk("");
    const { ok, data } = await persist(next, abogados, settings);
    if (!ok) {
      setAreas(areas);
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    applySaved(data);
    setOk("Actualizado. Se publica en 1-2 minutos.");
  }

  async function createArea() {
    if (!newAreaName.trim()) {
      setError("Escriba el nombre del área.");
      return;
    }
    setSaving(true);
    setError("");
    setOk("");
    const slug = slugify(newAreaName) || `area-${Date.now()}`;
    const next: Area = {
      id: slug,
      slug,
      name: newAreaName.trim(),
      description: newAreaDesc.trim(),
      points: newAreaPoints.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 6),
      icon: "balanza",
      visible: true,
      sort_order: areas.length,
    };
    const list = [...areas, next];
    const { ok, data } = await persist(list, abogados, settings);
    setSaving(false);
    if (!ok) {
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    applySaved(data);
    setNewAreaName("");
    setNewAreaDesc("");
    setNewAreaPoints("");
    setShowNewArea(false);
    setOk("Área agregada. Se publica en 1-2 minutos.");
  }

  async function deleteArea(id: string) {
    if (!confirm("¿Borrar esta área de la página?")) return;
    const next = areas.filter((x) => x.id !== id);
    setAreas(next);
    setError("");
    setOk("");
    const { ok, data } = await persist(next, abogados, settings);
    if (!ok) {
      setAreas(areas);
      setError(data.error ?? "No se pudo borrar");
      return;
    }
    applySaved(data);
    setOk("Área borrada. Se quita en 1-2 minutos.");
  }

  async function toggleAbogadoVisible(b: Abogado) {
    const next = abogados.map((x) => (x.id === b.id ? { ...x, visible: !x.visible } : x));
    setAbogados(next);
    setError("");
    setOk("");
    const { ok, data } = await persist(areas, next, settings);
    if (!ok) {
      setAbogados(abogados);
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    applySaved(data);
    setOk("Actualizado. Se publica en 1-2 minutos.");
  }

  async function createAbogado() {
    if (!newAbName.trim() || !newAbCedula.trim()) {
      setError("Escriba el nombre completo y la cédula.");
      return;
    }
    setSaving(true);
    setError("");
    setOk("");
    const slug = slugify(newAbName) || `ab-${Date.now()}`;
    const next: Abogado = {
      id: slug,
      name: newAbName.trim(),
      cedula: newAbCedula.replace(/\D/g, ""),
      rol: newAbRol.trim() || "Abogado · Socio",
      bio: newAbBio.trim(),
      visible: true,
      sort_order: abogados.length,
    };
    const list = [...abogados, next];
    const { ok, data } = await persist(areas, list, settings);
    setSaving(false);
    if (!ok) {
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    applySaved(data);
    setNewAbName("");
    setNewAbCedula("");
    setNewAbRol("Abogado · Socio");
    setNewAbBio("");
    setShowNewAbogado(false);
    setOk("Abogado agregado. Se publica en 1-2 minutos.");
  }

  async function deleteAbogado(id: string) {
    if (!confirm("¿Borrar a este abogado de la página?")) return;
    const next = abogados.filter((x) => x.id !== id);
    setAbogados(next);
    setError("");
    setOk("");
    const { ok, data } = await persist(areas, next, settings);
    if (!ok) {
      setAbogados(abogados);
      setError(data.error ?? "No se pudo borrar");
      return;
    }
    applySaved(data);
    setOk("Abogado borrado. Se quita en 1-2 minutos.");
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
          autoComplete="off"
        >
          <p className="text-center text-3xl">⚖️</p>
          <h1 className="mt-2 text-center font-serif text-2xl font-black text-navy-900">LEXUM · Administrador</h1>
          <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-800/45">🔒 Acceso restringido</p>
          <label className="label mt-5" htmlFor="adm-user">Usuario</label>
          <input
            id="adm-user"
            className="field"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Su usuario"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
          />
          <label className="label mt-4" htmlFor="adm-pass">Contraseña</label>
          <input
            id="adm-pass"
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Su contraseña"
            autoComplete="new-password"
            required
          />
          {error && <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}
          <button className="btn-primary mt-6 w-full">Entrar</button>
        </form>
        <a href="/" className="btn-ghost mx-auto mt-3 flex max-w-sm !py-3">← Volver a la página</a>
      </Shell>
    );
  }

  const top = [...areas]
    .map((a) => ({ ...a, count: metrics ? Number(metrics.likes[a.slug] ?? 0) : 0 }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...top.map((a) => a.count));
  const TAB_STYLE = (t: string) =>
    `shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${
      tab === t ? "bg-navy-800 text-white" : "border border-transparent bg-white text-navy-800 hover:bg-navy-50"
    }`;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        {/* Encabezado: oscuro con dorado, más visual sin texto largo */}
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-4 text-white shadow-card md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-base ring-1 ring-white/15">⚖️</span>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-200">Administrador</p>
            </div>
            <button className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/20" onClick={logout}>
              Salir
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white p-1 shadow-sm">
          <div className="flex gap-1 overflow-x-auto">
            {(
              [
                ["resumen", "Resumen"],
                ["areas", "Áreas"],
                ["equipo", "Equipo"],
                ["seguridad", "Seguridad"],
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
                  setSecDone("");
                  if (t === "resumen") loadMetrics();
                }}
                className={TAB_STYLE(t)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {ok && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">{ok}</p>}

        {tab === "resumen" && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="card-admin !p-3 text-center sm:!p-4">
                <p className="text-lg">👀</p>
                <p className="mt-0.5 font-serif text-xl font-black text-navy-900 sm:text-2xl">
                  {metrics ? metrics.visits.toLocaleString("es-MX") : "…"}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink/55">Visitas</p>
              </div>
              <div className="card-admin !p-3 text-center sm:!p-4">
                <p className="text-lg">💬</p>
                <p className="mt-0.5 font-serif text-xl font-black text-navy-900 sm:text-2xl">
                  {metrics ? metrics.totalLikes.toLocaleString("es-MX") : "…"}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink/55">Consultas</p>
              </div>
              <div className="card-admin !p-3 text-center sm:!p-4">
                <p className="text-lg">⚖️</p>
                <p className="mt-0.5 font-serif text-xl font-black text-navy-900 sm:text-2xl">
                  {areas.filter((a) => a.visible).length}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink/55">Áreas</p>
              </div>
            </div>

            <div className="card-admin !p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-base font-bold text-navy-900">Lo más consultado</h2>
                <button onClick={loadMetrics} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-800">
                  Actualizar
                </button>
              </div>
              <div className="mt-3 space-y-2.5">
                {top.map((a) => (
                  <div key={a.id}>
                    <div className="flex items-center justify-between gap-2 text-[13px]">
                      <p className="truncate font-semibold text-navy-900">{a.name}</p>
                      <p className="shrink-0 text-xs font-bold text-navy-800">{a.count}</p>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-navy-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-400 to-navy-800 transition-all duration-700"
                        style={{ width: `${Math.round((a.count / maxCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "areas" && !editingArea && (
          <div className="mt-4 space-y-2">
            {areas.map((a) => (
              <div key={a.id} className="flex items-center gap-2 rounded-2xl border border-navy-800/10 bg-white px-3 py-3 shadow-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy-800 text-xs font-black text-gold-300">
                  {a.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-navy-900">{a.name}</p>
                  <p className="truncate text-[11px] text-ink/55">{a.visible ? "Visible" : "Oculta"} · {a.points.slice(0, 2).join(" · ")}</p>
                </div>
                <button
                  onClick={() => toggleAreaVisible(a)}
                  className={`shrink-0 rounded-full px-2.5 py-1.5 text-xs font-bold ${a.visible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                >
                  {a.visible ? "Visible" : "Oculta"}
                </button>
                <button onClick={() => { setEditingArea({ ...a }); setShowNewArea(false); }} className="shrink-0 rounded-full bg-navy-800 px-2.5 py-1.5 text-xs font-semibold text-white">
                  Editar
                </button>
                <button onClick={() => deleteArea(a.id)} className="shrink-0 rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700">
                  Borrar
                </button>
              </div>
            ))}
            {!showNewArea ? (
              <button onClick={() => { setShowNewArea(true); setError(""); setOk(""); }} className="w-full rounded-2xl border-2 border-dashed border-navy-800/15 py-3 text-sm font-bold text-navy-800">
                + Agregar área
              </button>
            ) : (
              <div className="card-admin !p-4">
                <h2 className="font-serif text-base font-bold text-navy-900">Nueva área</h2>
                <label className="label mt-3">Nombre</label>
                <input className="field !py-2.5 text-[15px]" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} autoComplete="off" maxLength={40} />
                <label className="label mt-3">Descripción</label>
                <textarea className="field min-h-16 !py-2.5 text-[15px]" value={newAreaDesc} onChange={(e) => setNewAreaDesc(e.target.value)} maxLength={200} />
                <label className="label mt-3">Puntos (uno por línea, máx 6)</label>
                <textarea className="field min-h-20 !py-2.5 text-[15px]" value={newAreaPoints} onChange={(e) => setNewAreaPoints(e.target.value)} />
                <div className="mt-4 flex gap-2">
                  <button disabled={saving} onClick={createArea} className="btn-primary flex-1 !py-2.5 text-[14px]">
                    {saving ? "Guardando…" : "Guardar área"}
                  </button>
                  <button type="button" onClick={() => setShowNewArea(false)} className="btn-ghost !py-2.5 text-[14px]">Atrás</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "areas" && editingArea && (
          <div className="card-admin mt-4 !p-4">
            <h2 className="font-serif text-base font-bold text-navy-900">Editar área: {editingArea.name}</h2>
            <label className="label mt-3">Nombre</label>
            <input className="field !py-2.5 text-[15px]" value={editingArea.name} onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })} autoComplete="off" maxLength={40} />
            <label className="label mt-3">Descripción</label>
            <textarea className="field min-h-16 !py-2.5 text-[15px]" value={editingArea.description} onChange={(e) => setEditingArea({ ...editingArea, description: e.target.value })} maxLength={200} />
            <label className="label mt-3">Puntos (uno por línea, máx 6)</label>
            <textarea className="field min-h-20 !py-2.5 text-[15px]" value={editingArea.points.join("\n")} onChange={(e) => setEditingArea({ ...editingArea, points: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 6) })} />
            <label className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-navy-800/10 px-3">
              <input type="checkbox" checked={editingArea.visible} onChange={(e) => setEditingArea({ ...editingArea, visible: e.target.checked })} className="h-4 w-4 accent-[#0F2A44]" />
              <span className="text-sm font-semibold text-navy-900">Visible en la página</span>
            </label>
            <div className="mt-4 flex gap-2">
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
                  if (!ok) { setError(data.error ?? "No se pudo guardar"); return; }
                  applySaved(data);
                  setOk("Área guardada. Se publica en 1-2 minutos.");
                }}
                className="btn-primary flex-1 !py-2.5 text-[14px]"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={() => setEditingArea(null)} className="btn-ghost">Atrás</button>
            </div>
          </div>
        )}

        {tab === "equipo" && !editingAbogado && (
          <div className="mt-4 space-y-2">
            {abogados.map((b) => (
              <div key={b.id} className="flex items-center gap-2 rounded-2xl border border-navy-800/10 bg-white px-3 py-3 shadow-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-navy-800 font-serif text-xs font-black text-gold-300">
                  {b.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-navy-900">{b.name}</p>
                  <p className="truncate text-[11px] text-ink/55">Céd. {b.cedula} · {b.rol}</p>
                </div>
                <button onClick={() => toggleAbogadoVisible(b)} className={`shrink-0 rounded-full px-2.5 py-1.5 text-xs font-bold ${b.visible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                  {b.visible ? "Visible" : "Oculto"}
                </button>
                <button onClick={() => setEditingAbogado({ ...b })} className="shrink-0 rounded-full bg-navy-800 px-2.5 py-1.5 text-xs font-semibold text-white">
                  Editar
                </button>
                <button onClick={() => deleteAbogado(b.id)} className="shrink-0 rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700">Borrar</button>
              </div>
            ))}
            {!showNewAbogado ? (
              <button onClick={() => { setShowNewAbogado(true); setError(""); setOk(""); }} className="w-full rounded-2xl border-2 border-dashed border-navy-800/15 py-3 text-sm font-bold text-navy-800">+ Agregar abogado</button>
            ) : (
              <div className="card-admin !p-4">
                <h2 className="font-serif text-base font-bold text-navy-900">Nuevo abogado</h2>
                <label className="label mt-3">Nombre completo</label>
                <input className="field !py-2.5 text-[15px]" value={newAbName} onChange={(e) => setNewAbName(e.target.value)} autoComplete="off" maxLength={80} />
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Cédula</label>
                    <input className="field !py-2.5 text-[15px]" value={newAbCedula} onChange={(e) => setNewAbCedula(e.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="off" />
                  </div>
                  <div>
                    <label className="label">Rol</label>
                    <input className="field !py-2.5 text-[15px]" value={newAbRol} onChange={(e) => setNewAbRol(e.target.value)} autoComplete="off" />
                  </div>
                </div>
                <label className="label mt-3">Presentación</label>
                <textarea className="field min-h-16 !py-2.5 text-[15px]" value={newAbBio} onChange={(e) => setNewAbBio(e.target.value)} maxLength={180} />
                <div className="mt-4 flex gap-2">
                  <button disabled={saving} onClick={createAbogado} className="btn-primary flex-1 !py-2.5 text-[14px]">{saving ? "Guardando…" : "Guardar abogado"}</button>
                  <button type="button" onClick={() => setShowNewAbogado(false)} className="btn-ghost !py-2.5 text-[14px]">Atrás</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "equipo" && editingAbogado && (
          <div className="card-admin mt-4 !p-4">
            <h2 className="font-serif text-base font-bold text-navy-900">Editar abogado</h2>
            <label className="label mt-3">Nombre completo</label>
            <input className="field !py-2.5 text-[15px]" value={editingAbogado.name} onChange={(e) => setEditingAbogado({ ...editingAbogado, name: e.target.value })} autoComplete="off" maxLength={80} />
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Cédula Profesional Federal</label>
                <input className="field" value={editingAbogado.cedula} onChange={(e) => setEditingAbogado({ ...editingAbogado, cedula: e.target.value.replace(/\D/g, "") })} inputMode="numeric" autoComplete="off" />
              </div>
              <div>
                <label className="label">Rol</label>
                <input className="field" value={editingAbogado.rol} onChange={(e) => setEditingAbogado({ ...editingAbogado, rol: e.target.value })} autoComplete="off" />
              </div>
            </div>
            <label className="label mt-3">Presentación corta</label>
            <textarea className="field min-h-16 !py-2.5 text-[15px]" value={editingAbogado.bio} onChange={(e) => setEditingAbogado({ ...editingAbogado, bio: e.target.value })} maxLength={180} />
            <div className="mt-4 flex gap-2">
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
                  if (!ok) { setError(data.error ?? "No se pudo guardar"); return; }
                  applySaved(data);
                  setOk("Equipo guardado. Se publica en 1-2 minutos.");
                }}
                className="btn-primary flex-1 !py-2.5 text-[14px]"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" onClick={() => setEditingAbogado(null)} className="btn-ghost !py-2.5 text-[14px]">Atrás</button>
            </div>
          </div>
        )}

        {tab === "seguridad" && (
          <div className="mt-5 space-y-4">
            <div className="overflow-hidden rounded-4xl border border-navy-800/10 bg-gradient-to-br from-navy-800 to-navy-950 p-5 text-white shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-lg">🔐</span>
                <h2 className="font-serif text-base font-black">Seguridad del panel</h2>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/70">Para cambiar el usuario o la contraseña primero escriba las <b>actuales</b>. El cambio se activa en 1-2 minutos.</p>
            </div>

            {secDone && (
              <div className="rounded-4xl border border-green-200 bg-green-50 p-5">
                <p className="font-bold text-green-800">✓ {secDone}</p>
                <button onClick={async () => { await logout(); window.location.reload(); }} className="btn-primary mt-4 w-full !py-3.5">Entendido, volver a entrar</button>
              </div>
            )}

            {!secDone && (
              <form onSubmit={changeCredentials} className="card-admin" autoComplete="off">
                <h3 className="font-serif text-lg font-bold text-navy-900">1 · Confirme que es usted</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="sec-cur-user">Usuario actual</label>
                    <input id="sec-cur-user" className="field" value={secCurUser} onChange={(e) => setSecCurUser(e.target.value)} placeholder="Su usuario actual" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="sec-cur-pass">Contraseña actual</label>
                    <div className="relative">
                      <input id="sec-cur-pass" className="field pr-12" type={secShowCur ? "text" : "password"} value={secCurPass} onChange={(e) => setSecCurPass(e.target.value)} placeholder="••••••••" autoComplete="new-password" required />
                      <button type="button" onClick={() => setSecShowCur(!secShowCur)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-lg text-navy-800/50 active:scale-95" aria-label={secShowCur ? "Ocultar" : "Mostrar"}>{secShowCur ? "🙈" : "👁️"}</button>
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 font-serif text-lg font-bold text-navy-900">2 · Datos nuevos</h3>
                <label className="label mt-3" htmlFor="sec-new-user">Nuevo usuario</label>
                <input id="sec-new-user" className="field" value={secNewUser} onChange={(e) => setSecNewUser(e.target.value.toLowerCase())} placeholder="Vacío = conservar el actual" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={40} />
                <p className="hint">Si solo cambia la contraseña, deje este campo vacío.</p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="sec-new-pass">Nueva contraseña</label>
                    <div className="relative">
                      <input id="sec-new-pass" className="field pr-12" type={secShowNew ? "text" : "password"} value={secNewPass} onChange={(e) => setSecNewPass(e.target.value)} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
                      <button type="button" onClick={() => setSecShowNew(!secShowNew)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-lg text-navy-800/50 active:scale-95" aria-label={secShowNew ? "Ocultar" : "Mostrar"}>{secShowNew ? "🙈" : "👁️"}</button>
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="sec-confirm">Confirmar contraseña</label>
                    <input id="sec-confirm" className="field" type={secShowNew ? "text" : "password"} value={secConfirm} onChange={(e) => setSecConfirm(e.target.value)} placeholder="Repítala igual" autoComplete="new-password" />
                  </div>
                </div>
                <p className="hint">Si solo cambia el usuario, deje la contraseña nueva vacía.</p>

                <button disabled={secSaving} type="submit" className="btn-primary mt-5 w-full !py-4">
                  {secSaving ? "Guardando…" : "🔐 Actualizar credenciales"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper font-sans text-ink">{children}</div>;
}
