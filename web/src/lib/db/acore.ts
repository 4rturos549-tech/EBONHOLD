/**
 * Conexion read-only opcional hacia las BDs del server (acore_auth / acore_characters).
 *
 * Permite a la web:
 *  - leer estado de reinos y jugadores online
 *  - crear cuentas escribiendo en acore_auth.account (con hash SRP6)
 *
 * Si ACORE_DATABASE_URL no esta definido, la web simplemente mostrara
 * todos los reinos como "offline" y el registro estara deshabilitado.
 * Esto permite desarrollar la web sin tener el server arrancado.
 */
import mysql from "mysql2/promise";

const url = process.env.ACORE_DATABASE_URL;

declare global {
  var __acorePool: mysql.Pool | undefined;
}

export function getAcorePool(): mysql.Pool | null {
  if (!url) return null;
  if (globalThis.__acorePool) return globalThis.__acorePool;

  const pool = mysql.createPool({
    uri: url,
    connectionLimit: 3,
    enableKeepAlive: true,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__acorePool = pool;
  }
  return pool;
}

/**
 * Cuenta jugadores online por reino.
 * Lee de acore_characters.characters donde `online = 1`.
 */
export async function fetchOnlinePlayers(): Promise<
  Record<number, { total: number; alliance: number; horde: number }>
> {
  const pool = getAcorePool();
  if (!pool) return {};

  const [rows] = await pool.query<mysql.RowDataPacket[]>(`
    SELECT
      c.online,
      c.race,
      COUNT(*) as count
    FROM acore_characters.characters c
    WHERE c.online = 1
    GROUP BY c.race
  `);

  // Razas Alianza: 1,3,4,7,11  |  Horda: 2,5,6,8,10
  const alliance = new Set([1, 3, 4, 7, 11]);
  const result: Record<number, { total: number; alliance: number; horde: number }> =
    { 1: { total: 0, alliance: 0, horde: 0 } };

  for (const row of rows) {
    const c = Number(row.count);
    result[1].total += c;
    if (alliance.has(Number(row.race))) result[1].alliance += c;
    else result[1].horde += c;
  }
  return result;
}
