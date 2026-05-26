/**
 * SRP6 verifier generator compatible con AzerothCore (WoTLK 3.3.5a).
 *
 * Referencia: src/server/authserver/Server/AuthSession.cpp del core.
 * Algoritmo:
 *   1. h1 = SHA1(upper(username) + ":" + upper(password))
 *   2. h2 = SHA1(salt || h1)              # salt = 32 bytes random
 *   3. x  = BigInt(h2 como little-endian)
 *   4. v  = g^x mod N
 *   5. salt y verifier se almacenan little-endian (32 bytes)
 *
 * Implementacion pura sin dependencias.
 */
import { createHash, randomBytes } from "node:crypto";

// Parametros SRP6 de AzerothCore (constantes del protocolo WoW)
const N = BigInt(
  "0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7",
);
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
  // Convierte BigInt a buffer de 32 bytes little-endian
  let hex = n.toString(16);
  if (hex.length % 2 === 1) hex = "0" + hex;
  // big-endian hex → buffer → reverse a LE
  const beBuf = Buffer.from(hex, "hex");
  const leBuf = Buffer.from(beBuf).reverse();
  // pad a 32 bytes
  if (leBuf.length < 32) {
    return Buffer.concat([leBuf, Buffer.alloc(32 - leBuf.length)]);
  }
  if (leBuf.length > 32) return leBuf.subarray(0, 32);
  return leBuf;
}

function leBufferToBigInt(buf: Buffer): bigint {
  const beBuf = Buffer.from(buf).reverse();
  return BigInt("0x" + beBuf.toString("hex"));
}

export interface Srp6Credentials {
  salt: Buffer; // 32 bytes LE
  verifier: Buffer; // 32 bytes LE
}

export function calculateSrp6Verifier(
  username: string,
  password: string,
): Srp6Credentials {
  const salt = randomBytes(32);

  const upperPair = username.toUpperCase() + ":" + password.toUpperCase();
  const h1 = createHash("sha1").update(upperPair).digest(); // 20 bytes
  const h2 = createHash("sha1").update(Buffer.concat([salt, h1])).digest(); // 20 bytes

  const x = leBufferToBigInt(h2);
  const v = modPow(g, x, N);

  return { salt, verifier: bigintToLE32(v) };
}
