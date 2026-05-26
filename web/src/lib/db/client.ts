/**
 * Cliente Drizzle hacia la BD web (ebonhold_web).
 *
 * Lee la connection string de DATABASE_URL en formato:
 *   mysql://user:password@host:port/ebonhold_web
 *
 * En Vercel: configurar como env var del proyecto.
 * En local:  poner en /web/.env.local
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

declare global {
  var __dbPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  if (!url) {
    throw new Error(
      "DATABASE_URL no esta definido. Copia .env.example a .env.local y configuralo.",
    );
  }
  return mysql.createPool({
    uri: url,
    connectionLimit: 5,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

// Reutilizar el pool entre hot-reloads de dev (Next.js destruye el modulo)
const pool = globalThis.__dbPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__dbPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });

export { schema };
