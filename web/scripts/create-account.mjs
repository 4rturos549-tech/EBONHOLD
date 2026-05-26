/**
 * Crea una cuenta de juego en acore_auth.account con hash SRP6 valido.
 *
 * Uso:
 *   node scripts/create-account.mjs <username> <password> [gmlevel]
 *
 * gmlevel: 0=jugador, 1=moderador, 2=GM, 3=admin (default 0)
 */
import mysql from "mysql2/promise";
import { createHash, randomBytes } from "node:crypto";

const [, , username, password, gmLevelStr] = process.argv;
if (!username || !password) {
  console.error("Uso: node create-account.mjs <username> <password> [gmlevel]");
  process.exit(1);
}
const gmLevel = parseInt(gmLevelStr ?? "0", 10);

// --- SRP6 (inline, para que el script no dependa del build de TS) ---
const N = BigInt("0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7");
const g = 7n;

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
  const be = Buffer.from(hex, "hex");
  const le = Buffer.from(be).reverse();
  if (le.length < 32) return Buffer.concat([le, Buffer.alloc(32 - le.length)]);
  return le.subarray(0, 32);
}

const salt = randomBytes(32);
const upper = username.toUpperCase() + ":" + password.toUpperCase();
const h1 = createHash("sha1").update(upper).digest();
const h2 = createHash("sha1").update(Buffer.concat([salt, h1])).digest();
const x = BigInt("0x" + Buffer.from(h2).reverse().toString("hex"));
const verifier = bigintToLE32(modPow(g, x, N));

const url = process.env.ACORE_AUTH_URL ?? "mysql://root:azerothcore@localhost:3306/acore_auth";

const conn = await mysql.createConnection(url);

// Crear cuenta
await conn.execute(
  `INSERT INTO account (username, salt, verifier, reg_mail, email, joindate, expansion)
   VALUES (?, ?, ?, ?, ?, NOW(), 2)
   ON DUPLICATE KEY UPDATE salt = VALUES(salt), verifier = VALUES(verifier)`,
  [username.toUpperCase(), salt, verifier, "", ""],
);

const [rows] = await conn.execute("SELECT id FROM account WHERE username = ?", [
  username.toUpperCase(),
]);
const accountId = rows[0].id;

// Asignar gmlevel si se pidio
if (gmLevel > 0) {
  await conn.execute(
    `INSERT INTO account_access (id, gmlevel, RealmID)
     VALUES (?, ?, -1)
     ON DUPLICATE KEY UPDATE gmlevel = VALUES(gmlevel)`,
    [accountId, gmLevel],
  );
}

await conn.end();

console.log(`✓ Cuenta ${username.toUpperCase()} creada (id=${accountId}, gmlevel=${gmLevel})`);
