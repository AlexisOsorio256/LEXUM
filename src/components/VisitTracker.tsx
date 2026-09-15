"use client";

import { useEffect } from "react";

/** Cuenta una visita por sesión (sessionStorage) para no inflar métricas. */
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("lexum_visit")) return;
      sessionStorage.setItem("lexum_visit", "1");
    } catch {
      /* sigue e intenta contar */
    }
    fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
  }, []);
  return null;
}
