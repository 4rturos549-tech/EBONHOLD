import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createHash } from "node:crypto";
import { verifyAccount } from "@/lib/db/acore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const USERNAME_RE = /^[A-Z0-9_]{3,16}$/;

interface LoginBody {
  username?: string;
  password?: string;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * SRP6 verifier recomputed con el salt almacenado y la password enviada.
 * Si coincide con el verifier almacenado, el password es correcto.
 *
 * Mismo algoritmo que `web/src/lib/auth/srp6.ts` pero recibiendo salt
 * (no generandolo aleatorio).
 */
const N = BigInt("0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7");
const g = 7n;

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp /= 2n;
    base = (base * base) % mod;
  }
  return result;
}

function bigintToLE32(n: bigint): Buffer {
  let hex = n.toString(16);
  if (hex.length % 2 === 1) hex = "0" + hex;
  const le = Buffer.from(hex, "hex").reverse();
  if (le.length < 32) return Buffer.concat([le, Buffer.alloc(32 - le.length)]);
  return le.subarray(0, 32);
}

function computeVerifierFromSalt(username: string, password: string, salt: Buffer): Buffer {
  const upper = username.toUpperCase() + ":" + password.toUpperCase();
  const h1 = createHash("sha1").update(upper).digest();
  const h2 = createHash("sha1").update(Buffer.concat([salt, h1])).digest();
  const x = BigInt("0x" + Buffer.from(h2).reverse().toString("hex"));
  return bigintToLE32(modPow(g, x, N));
}

function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function POST(req: Request) {
  let body: LoginBody;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Body JSON invalido" }, 400);
  }

  const username = body.username?.trim().toUpperCase() ?? "";
  const password = body.password ?? "";

  if (!USERNAME_RE.test(username)) {
    return json({ ok: false, error: "Credenciales invalidas" }, 401);
  }
  if (password.length < 6) {
    return json({ ok: false, error: "Credenciales invalidas" }, 401);
  }

  // 1) Si BRIDGE_URL esta configurado -> proxy via bridge (Vercel)
  if (process.env.BRIDGE_URL) {
    const result = await verifyAccount(username, password);
    return json(result, result.status);
  }

  // 2) Fallback: MySQL directo (local)
  const dbUrl = process.env.ACORE_DATABASE_URL;
  if (!dbUrl) {
    return json(
      { ok: false, error: "Login no disponible: el servidor no esta accesible." },
      503,
    );
  }

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(dbUrl.replace(/\/[^/]*$/, "/acore_auth"));

    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      "SELECT id, salt, verifier FROM account WHERE username = ? LIMIT 1",
      [username],
    );

    if (rows.length === 0) {
      return json({ ok: false, error: "Credenciales invalidas" }, 401);
    }

    const row = rows[0];
    const storedSalt = Buffer.isBuffer(row.salt) ? row.salt : Buffer.from(row.salt);
    const storedVerifier = Buffer.isBuffer(row.verifier) ? row.verifier : Buffer.from(row.verifier);

    const computed = computeVerifierFromSalt(username, password, storedSalt);

    if (!constantTimeEqual(computed, storedVerifier)) {
      return json({ ok: false, error: "Credenciales invalidas" }, 401);
    }

    return json({
      ok: true,
      username,
      accountId: row.id,
    });
  } catch (err) {
    console.error("[api/auth/login]", err);
    return json({ ok: false, error: "Error interno verificando credenciales" }, 500);
  } finally {
    if (conn) await conn.end().catch(() => undefined);
  }
}
