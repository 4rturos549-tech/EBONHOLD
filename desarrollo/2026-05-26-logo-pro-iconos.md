# 2026-05-26 · Logo SVG profesional + iconos del instalador

## Objetivo

Subir el listón visual del logo (más detalle, mejores gradientes, sparkles, halo) y generar **todos los formatos** que necesita electron-builder (`.ico`, `.icns`, `.png`) desde un único SVG master.

## El nuevo logo

Diamante de Acherus con shard de Frostmourne. **13 capas** vectoriales:

1. **Halo radial** exterior — glow cyan sutil
2. **Diamante exterior** con gradiente metálico de 5 stops (blanco → cyan → azul oscuro)
3. **Doble borde inner bevel** — anillo oscuro tipo "metal pulido"
4. **Cripta interior** con gradiente radial obsidiana
5. **Anillo decorativo intermedio** con stroke cyan al 45%
6. **4 mini-diamantes** en las caras del anillo intermedio
7. **4 estrellas de 8 puntas** en las diagonales (sparkles)
8. **Halo elíptico** detrás del shard (filtrado con `feGaussianBlur`)
9. **Shard principal** kite-shaped con gradiente blade (5 stops)
10. **Faceta lateral** del shard (gradiente horizontal para profundidad 3D)
11. **Línea central** blanca del shard al 85%
12. **4 líneas de talla** facetadas (superior blancas, inferior azul oscuro)
13. **Núcleo brillante** triple-circle en el centro
14. **4 cardinales** con glow radial + dot blanco central

Master: [`launcher/resources/icon.svg`](../launcher/resources/icon.svg) (256×256 viewBox).

Misma SVG embebida también en:
- [`launcher/src/renderer/components/ui/Logo.tsx`](../launcher/src/renderer/components/ui/Logo.tsx)
- [`web/src/components/ui/logo.tsx`](../web/src/components/ui/logo.tsx)
- [`web/public/logo.svg`](../web/public/logo.svg)
- [`web/public/favicon.svg`](../web/public/favicon.svg) (versión simplificada para tamaños diminutos)

## Pipeline de generación de iconos

`launcher/scripts/build-icons.mjs`:

1. **`@resvg/resvg-js`** rasteriza el SVG → PNG 512 (Linux) y PNG 1024 (master)
2. **`png2icons`** convierte el PNG 1024 a:
   - `icon.ico` — formato Windows multi-resolución (incluye 16/24/32/48/64/128/256 px)
   - `icon.icns` — formato macOS multi-resolución (16 hasta 1024)

```bash
npm run icons
# → resources/icon.png       (512×512, Linux)
# → resources/icon@1024.png  (master para regenerar)
# → resources/icon.ico       (Windows, ~422 KB)
# → resources/icon.icns      (macOS, ~390 KB)
```

### Por qué pure JS

Sin dependencias nativas (excepto el binding de resvg-js que viene precompilado para Windows/Mac/Linux). Funciona en GitHub Actions sin instalar ImageMagick o tools de sistema.

## Resultado visual

El logo a 1024×1024 muestra:
- Diamante exterior con tránsito perfecto blanco→cyan→azul oscuro
- Bevel interior creando efecto "marco de metal pulido"
- Cripta obsidiana de fondo con vignette radial
- Shard central con apariencia translúcida-cristalina
- Núcleo brillante blanco que da foco al centro
- Sparkles cyan en las diagonales
- Glows en los 4 cardinales

A tamaños pequeños (16px, 32px) el shard central sigue siendo legible — el contraste blanco/azul mantiene la identidad.

## Cambios en el build pipeline

`launcher/package.json` añade:

```json
"scripts": {
  "icons": "node scripts/build-icons.mjs"
}
```

Generar iconos no es parte del build normal (toma ~1.5s pero no es necesario en cada build). Se corre **manualmente cuando se actualiza el SVG**:

```powershell
cd D:\wow\launcher
npm run icons
git add resources/
git commit -m "chore(icons): regenerate from SVG"
```

`electron-builder.yml` ya apuntaba a `resources/icon.{ico,icns,png}` — funciona out-of-the-box.

## Verificación

```bash
cd launcher
npm run build      # ✓ main + preload + renderer en <4s
npm run typecheck  # ✓ sin errores

cd ../web
npm run build      # ✓ 41 páginas estáticas, 0 warnings
```

## Próximo paso real

Sacar la primera release del launcher:

```powershell
git tag launcher-v0.1.0
git push --tags
```

GitHub Actions (workflow `launcher-release.yml`) builda los 3 OS y publica el release. Los iconos ya estarán embebidos en los instaladores.
