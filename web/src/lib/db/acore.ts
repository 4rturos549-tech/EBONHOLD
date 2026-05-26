/**
 * Acceso de la web a los datos del server WoW.
 *
 * Dos modos:
 *   1) Local/dev: conexion MySQL directa via ACORE_DATABASE_URL.
 *   2) Produccion (Vercel): HTTP al Bridge via BRIDGE_URL + BRIDGE_KEY.
 *
 * El bridge expone las mismas operaciones via HTTP detras de Cloudflare Tunnel.
 * Si ninguna esta configurada, las funciones devuelven datos vacios graciosamente.
 */
import mysql from "mysql2/promise";

const BRIDGE_URL = process.env.BRIDGE_URL?.replace(/\/$/, "");
const BRIDGE_KEY = process.env.BRIDGE_KEY ?? "";
const DB_URL = process.env.ACORE_DATABASE_URL;

declare global {
  var __acorePool: mysql.Pool | undefined;
}

function getAcorePool(): mysql.Pool | null {
  if (!DB_URL) return null;
  if (globalThis.__acorePool) return globalThis.__acorePool;
  const pool = mysql.createPool({
    uri: DB_URL,
    connectionLimit: 3,
    enableKeepAlive: true,
  });
  if (process.env.NODE_ENV !== "production") {
    globalThis.__acorePool = pool;
  }
  return pool;
}

async function bridgeFetch(path: string, init?: RequestInit): Promise<Response | null> {
  if (!BRIDGE_URL || !BRIDGE_KEY) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${BRIDGE_URL}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: {
        ...init?.headers,
        "X-Bridge-Key": BRIDGE_KEY,
      },
    });
    clearTimeout(timer);
    return res;
  } catch {
    return null;
  }
}

/* ============================================================
   Jugadores online
   ============================================================ */
export interface OnlineStats {
  total: number;
  alliance: number;
  horde: number;
}

export async function fetchOnlinePlayers(): Promise<Record<number, OnlineStats>> {
  // 1) Intentar via bridge (Vercel-friendly)
  const res = await bridgeFetch("/stats/online");
  if (res && res.ok) {
    const data = (await res.json()) as { total: number; alliance: number; horde: number };
    return { 1: { total: data.total, alliance: data.alliance, horde: data.horde } };
  }

  // 2) Fallback: MySQL directo (dev local)
  const pool = getAcorePool();
  if (!pool) return {};

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("USE acore_characters");
      const [rows] = await conn.query<mysql.RowDataPacket[]>(`
        SELECT race, COUNT(*) as count
        FROM characters
        WHERE online = 1
        GROUP BY race
      `);
      const ALLY = new Set([1, 3, 4, 7, 11]);
      const stat: OnlineStats = { total: 0, alliance: 0, horde: 0 };
      for (const r of rows) {
        const c = Number(r.count);
        stat.total += c;
        if (ALLY.has(Number(r.race))) stat.alliance += c;
        else stat.horde += c;
      }
      return { 1: stat };
    } finally {
      conn.release();
    }
  } catch {
    return {};
  }
}

/* ============================================================
   Registro de cuenta
   ============================================================ */
export interface RegisterResult {
  ok: boolean;
  username?: string;
  error?: string;
  status: number;
}

export async function registerAccount(
  username: string,
  password: string,
  email: string,
): Promise<RegisterResult> {
  // Via bridge si esta disponible
  const res = await bridgeFetch("/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  if (res) {
    const data = (await res.json()) as { ok: boolean; username?: string; error?: string };
    return { ...data, status: res.status };
  }
  return { ok: false, error: "Servicio de registro no disponible", status: 503 };
}

/* ============================================================
   Verificacion de credenciales (login)
   ============================================================ */
export interface VerifyResult {
  ok: boolean;
  username?: string;
  accountId?: number;
  error?: string;
  status: number;
}

export async function verifyAccount(
  username: string,
  password: string,
): Promise<VerifyResult> {
  const res = await bridgeFetch("/accounts/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res) {
    const data = (await res.json()) as {
      ok: boolean;
      username?: string;
      accountId?: number;
      error?: string;
    };
    return { ...data, status: res.status };
  }
  return { ok: false, error: "Servicio de login no disponible", status: 503 };
}
