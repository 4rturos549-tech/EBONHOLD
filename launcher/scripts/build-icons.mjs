/**
 * Genera todos los iconos del instalador a partir de resources/icon.svg.
 *
 * Output:
 *   resources/icon.png       (512x512, Linux)
 *   resources/icon@1024.png  (master para .ico y .icns)
 *   resources/icon.ico       (Windows, multi-size: 16/24/32/48/64/128/256)
 *   resources/icon.icns      (macOS, todos los tamaños desde 16 a 1024)
 *
 * Uso:
 *   npm run icons
 */
import { Resvg } from "@resvg/resvg-js";
import png2icons from "png2icons";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const resourcesDir = resolve(__dirname, "..", "resources");

async function svgToPng(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

async function main() {
  await mkdir(resourcesDir, { recursive: true });

  const svgPath = resolve(resourcesDir, "icon.svg");
  console.log(`→ Leyendo ${svgPath}`);
  const svg = await readFile(svgPath);

  // 1) PNG 512 para Linux
  console.log("→ Renderizando icon.png (512x512) para Linux");
  const png512 = await svgToPng(svg, 512);
  await writeFile(resolve(resourcesDir, "icon.png"), png512);

  // 2) PNG 1024 master para ICO/ICNS
  console.log("→ Renderizando master 1024x1024");
  const png1024 = await svgToPng(svg, 1024);
  await writeFile(resolve(resourcesDir, "icon@1024.png"), png1024);

  // 3) ICO (Windows) — png2icons genera todos los tamaños del .ico desde el master
  console.log("→ Generando icon.ico (Windows multi-size)");
  const ico = png2icons.createICO(png1024, png2icons.BILINEAR, 0, false);
  if (!ico) throw new Error("Fallo creando ICO");
  await writeFile(resolve(resourcesDir, "icon.ico"), ico);

  // 4) ICNS (macOS) — todos los tamaños 16..1024
  console.log("→ Generando icon.icns (macOS multi-size)");
  const icns = png2icons.createICNS(png1024, png2icons.BILINEAR, 0);
  if (!icns) throw new Error("Fallo creando ICNS");
  await writeFile(resolve(resourcesDir, "icon.icns"), icns);

  console.log("✓ Iconos generados en", resourcesDir);
}

main().catch((err) => {
  console.error("✗ Error:", err);
  process.exit(1);
});
