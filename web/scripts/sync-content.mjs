/**
 * Copia los devlogs desde /desarrollo (raiz del repo) a /web/content/desarrollo.
 *
 * Robusto:
 *   - Si la fuente no existe (p.ej. Vercel con Root Directory = web/ sin
 *     "Include source files outside" activado), no rompe el build.
 *   - Solo escribe si encuentra archivos.
 */
import { existsSync, mkdirSync, cpSync } from "node:fs";
import { resolve } from "node:path";

const candidates = [
  resolve("..", "desarrollo"),
  resolve(".", "desarrollo"),
];

const dest = resolve("content", "desarrollo");

const src = candidates.find((p) => existsSync(p));

if (!src) {
  console.log(
    "[sync-content] No se encontro /desarrollo (probablemente Vercel sin parent files). Saltando.",
  );
  mkdirSync(dest, { recursive: true });
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true, force: true });
console.log(`[sync-content] OK: ${src} -> ${dest}`);
