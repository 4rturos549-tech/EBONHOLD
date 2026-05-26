import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { calculateSrp6Verifier } from "@/lib/auth/srp6";
import { registerAccount } from "@/lib/db/acore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const USERNAME_RE = /^[A-Z0-9_]{3,16}$/;

interface RegisterBody {
  username?: string;
  password?: string;
  email?: string;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  let body: RegisterBody;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Body JSON invalido" }, 400);
  }

  const username = body.username?.trim().toUpperCase() ?? "";
  const password = body.password ?? "";
  const email = (body.email ?? "").trim().toLowerCase();

  if (!USERNAME_RE.test(username)) {
    return json(
      { ok: false, error: "Nombre de usuario invalido (3-16 chars, A-Z 0-9 _)" },
      400,
    );
  }
  if (password.length < 6 || password.length > 64) {
    return json({ ok: false, error: "Contrasena debe tener entre 6 y 64 caracteres" }, 400);
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ ok: false, error: "Email invalido" }, 400);
  }

  // 1) Si BRIDGE_URL esta configurado (caso Vercel) -> proxy via bridge
  if (process.env.BRIDGE_URL) {
    const result = await registerAccount(username, password, email);
    return json(result, result.status);
  }

  // 2) Fallback: MySQL directo (caso dev local con ACORE_DATABASE_URL)
  const dbUrl = process.env.ACORE_DATABASE_URL;
  if (!dbUrl) {
    return json(
      {
        ok: false,
        error:
          "Registro no disponible: configura BRIDGE_URL (produccion) o ACORE_DATABASE_URL (local).",
      },
      503,
    );
  }

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(dbUrl.replace(/\/[^/]*$/, "/acore_auth"));

    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      "SELECT id FROM account WHERE username = ? LIMIT 1",
      [username],
    );
    if (rows.length > 0) {
      return json({ ok: false, error: "El nombre de usuario ya esta en uso" }, 409);
    }

    const { salt, verifier } = calculateSrp6Verifier(username, password);

    await conn.execute(
      `INSERT INTO account
       (username, salt, verifier, reg_mail, email, joindate, expansion)
       VALUES (?, ?, ?, ?, ?, NOW(), 2)`,
      [username, salt, verifier, email, email],
    );

    return json({ ok: true, username });
  } catch (err) {
    console.error("[api/auth/register]", err);
    return json({ ok: false, error: "Error interno creando la cuenta" }, 500);
  } finally {
    if (conn) await conn.end().catch(() => undefined);
  }
}
