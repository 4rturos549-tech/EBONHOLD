/**
 * Ebonhold Bridge — mini HTTP API local que expone read-queries y
 * registro de cuentas hacia el exterior via Cloudflare Tunnel.
 *
 * Vive en localhost:4000, lo expone Cloudflare Tunnel a internet.
 * Vercel lo llama para tener datos en vivo del server.
 *
 * Endpoints:
 *   GET  /health                       -> ping
 *   GET  /stats/online                 -> jugadores online (total + por faccion)
 *   GET  /accounts/exists/:username    -> 200 si existe, 404 si no
 *   POST /accounts                     -> crea cuenta con SRP6
 *
 * Autenticacion: header X-Bridge-Key debe coincidir con BRIDGE_KEY env.
 */
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import mysql from "mysql2/promise";
import { createHash, randomBytes } from "node:crypto";

const PORT = parseInt(process.env.BRIDGE_PORT ?? "4000", 10);
const KEY = process.env.BRIDGE_KEY ?? "";
const DB_URL =
  process.env.ACORE_DATABASE_URL ??
  "mysql://root:azerothcore@ac-database:3306/";

if (!KEY) {
  console.error("ERROR: BRIDGE_KEY no definido. Aborto.");
  process.exit(1);
}

// --- SRP6 inline (mismo algoritmo que web/src/lib/auth/srp6.ts) ---
const SRP_N = BigInt("0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7");
const SRP_G = 7n;

function modPow(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp /= 2n;
    base = (base * base) % mod;
  }
  return result;
}

function bigintToLE32(n) {
  let hex = n.toString(16);
  if (hex.length % 2 === 1) hex = "0" + hex;
  const le = Buffer.from(hex, "hex").reverse();
  if (le.length < 32) return Buffer.concat([le, Buffer.alloc(32 - le.length)]);
  return le.subarray(0, 32);
}

function calculateSrp6Verifier(username, password) {
  const salt = randomBytes(32);
  const upper = username.toUpperCase() + ":" + password.toUpperCase();
  const h1 = createHash("sha1").update(upper).digest();
  const h2 = createHash("sha1").update(Buffer.concat([salt, h1])).digest();
  const x = BigInt("0x" + Buffer.from(h2).reverse().toString("hex"));
  return { salt, verifier: bigintToLE32(modPow(SRP_G, x, SRP_N)) };
}

function computeVerifierFromSalt(username, password, salt) {
  const upper = username.toUpperCase() + ":" + password.toUpperCase();
  const h1 = createHash("sha1").update(upper).digest();
  const h2 = createHash("sha1").update(Buffer.concat([salt, h1])).digest();
  const x = BigInt("0x" + Buffer.from(h2).reverse().toString("hex"));
  return bigintToLE32(modPow(SRP_G, x, SRP_N));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// --- Pool MySQL compartido ---
const pool = mysql.createPool({
  uri: DB_URL,
  connectionLimit: 5,
  enableKeepAlive: true,
});

async function query(sql, params, db = "acore_auth") {
  const conn = await pool.getConnection();
  try {
    await conn.query(`USE \`${db}\``);
    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

// --- App Hono ---
const app = new Hono();

app.use("*", cors({ origin: "*" }));

// Middleware de auth (excepto /health)
app.use("*", async (c, next) => {
  if (c.req.path === "/health") return next();
  const got = c.req.header("X-Bridge-Key") ?? "";
  if (got !== KEY) return c.json({ ok: false, error: "unauthorized" }, 401);
  await next();
});

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

// Conteo de jugadores online
app.get("/stats/online", async (c) => {
  // Razas: 1,3,4,7,11 = Alianza | 2,5,6,8,10 = Horda
  const rows = await query(
    "SELECT race, COUNT(*) as n FROM characters WHERE online = 1 GROUP BY race",
    [],
    "acore_characters",
  );
  const ALLY = new Set([1, 3, 4, 7, 11]);
  let alliance = 0, horde = 0;
  for (const r of rows) {
    if (ALLY.has(Number(r.race))) alliance += Number(r.n);
    else horde += Number(r.n);
  }
  return c.json({
    ok: true,
    total: alliance + horde,
    alliance,
    horde,
    ts: Date.now(),
  });
});

// Comprobar duplicado de username
app.get("/accounts/exists/:username", async (c) => {
  const username = c.req.param("username").toUpperCase();
  const rows = await query(
    "SELECT id FROM account WHERE username = ? LIMIT 1",
    [username],
  );
  return c.json({ ok: true, exists: rows.length > 0 });
});

// Crear cuenta (proxy de la API de la web hacia la BD)
app.post("/accounts", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "JSON invalido" }, 400);
  }
  const username = (body.username ?? "").toUpperCase().trim();
  const password = body.password ?? "";
  const email = (body.email ?? "").trim().toLowerCase();

  if (!/^[A-Z0-9_]{3,16}$/.test(username)) {
    return c.json({ ok: false, error: "Usuario invalido" }, 400);
  }
  if (password.length < 6 || password.length > 64) {
    return c.json({ ok: false, error: "Contrasena 6-64 chars" }, 400);
  }

  const existing = await query(
    "SELECT id FROM account WHERE username = ? LIMIT 1",
    [username],
  );
  if (existing.length > 0) {
    return c.json({ ok: false, error: "Usuario ya existe" }, 409);
  }

  const { salt, verifier } = calculateSrp6Verifier(username, password);
  await query(
    `INSERT INTO account (username, salt, verifier, reg_mail, email, joindate, expansion)
     VALUES (?, ?, ?, ?, ?, NOW(), 2)`,
    [username, salt, verifier, email, email],
  );

  return c.json({ ok: true, username });
});

// Verificar credenciales sin crear sesion (login simple)
app.post("/accounts/verify", async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: "JSON invalido" }, 400);
  }
  const username = (body.username ?? "").toUpperCase().trim();
  const password = body.password ?? "";
  if (!/^[A-Z0-9_]{3,16}$/.test(username) || password.length < 6) {
    return c.json({ ok: false, error: "Credenciales invalidas" }, 401);
  }

  const rows = await query(
    "SELECT id, salt, verifier FROM account WHERE username = ? LIMIT 1",
    [username],
  );
  if (rows.length === 0) {
    return c.json({ ok: false, error: "Credenciales invalidas" }, 401);
  }
  const row = rows[0];
  const storedSalt = Buffer.isBuffer(row.salt) ? row.salt : Buffer.from(row.salt);
  const storedVerifier = Buffer.isBuffer(row.verifier) ? row.verifier : Buffer.from(row.verifier);
  const computed = computeVerifierFromSalt(username, password, storedSalt);

  if (!constantTimeEqual(computed, storedVerifier)) {
    return c.json({ ok: false, error: "Credenciales invalidas" }, 401);
  }
  return c.json({ ok: true, username, accountId: row.id });
});

serve({ fetch: app.fetch, port: PORT, hostname: "0.0.0.0" });
console.log(`[bridge] escuchando en :${PORT}`);
