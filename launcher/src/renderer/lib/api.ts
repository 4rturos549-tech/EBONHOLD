/**
 * Cliente HTTP del launcher hacia la API de la web.
 *
 * Endpoints consumidos:
 *   GET /api/realms  → estado en vivo de los reinos
 *   GET /api/news    → últimos devlogs
 *
 * Todas las llamadas tienen timeout corto y manejan fallos gracefully:
 * si el usuario no tiene internet o la web está caída, el launcher
 * sigue funcionando con datos vacíos / placeholders.
 */
import { brand } from "@shared/brand";

const BASE = brand.webUrl.replace(/\/$/, "");
const TIMEOUT_MS = 6000;

export interface ApiRealm {
  id: string;
  name: string;
  type: "PvE" | "PvP" | "RP" | "RP-PvP";
  status: "online" | "offline" | "maintenance";
  players: number;
  population: "baja" | "media" | "alta" | "llena";
  alliance: number;
  horde: number;
}

export interface ApiNewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  url: string;
}

async function fetchJSON<T>(path: string): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRealms(): Promise<ApiRealm[]> {
  try {
    const data = await fetchJSON<{ realms: ApiRealm[] }>("/api/realms");
    return data.realms;
  } catch {
    return [];
  }
}

export async function fetchNews(limit = 5): Promise<ApiNewsItem[]> {
  try {
    const data = await fetchJSON<{ items: ApiNewsItem[] }>(`/api/news?limit=${limit}`);
    return data.items;
  } catch {
    return [];
  }
}
