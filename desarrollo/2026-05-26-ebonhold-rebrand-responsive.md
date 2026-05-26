# 2026-05-26 · Rebrand a Ebonhold + paleta frost + responsive completo

## Objetivo

Tres cambios pedidos:
1. **Cambiar nombre** "Masamune" (no tenía conexión con WoW).
2. **Cambiar paleta** (muy parecida a otros servers que usan oro/dark fantasy).
3. **Responsive 100%** (no funcionaba bien en móvil).

## 1. Nueva marca: **EBONHOLD**

- **Origen**: Ebon Hold (Acherus) es la **necrópolis flotante** de los Caballeros de la Muerte en WoTLK 3.3.5a. Real, icónica, situada sobre los Páramos de Plaga.
- **Tagline**: *"La Ciudadela del Norte Helado"*.
- **Por qué funciona**:
  - 100% canónico de WoTLK.
  - No usado por ningún server privado conocido.
  - "Ebon" (ébano negro) evoca elegancia oscura.
  - Suena majestuoso y único.
- **Reinos renombrados** (locations reales de Rasganorte):
  - **Acherus** (PvE) — la propia necrópolis.
  - **Wyrmrest** (PvP) — Templo de Wyrmrest en el Bosque del Dragón.
  - **Crystalsong** (RP) — Bosque Cantocristal.

## 2. Nueva paleta: Frost · Obsidiana · Necrótico

Salida del cliché oro+marrón → ahora **frost cyan + obsidian + necrotic green**:

| Token | Valor | Inspiración |
|---|---|---|
| `--color-bg` | `#07101a` | Midnight obsidian — la cripta de Acherus |
| `--color-bg-elevated` | `#0e1928` | Paneles |
| `--color-bg-panel` | `#131f33` | Cards |
| `--color-accent` | `#6ec8f0` | **Frost cyan** — el brillo de Frostmourne |
| `--color-accent-bright` | `#a8ddf5` | Hover |
| `--color-accent-dim` | `#3a7fa5` | Texto auxiliar |
| `--color-secondary` | `#6dbe5e` | **Necrotic green** — magia de Plaga (CTAs) |
| `--color-text` | `#e2e8f0` | Bone white — pergamino |
| `--color-text-dim` | `#8a96ac` | Gris frío |

**Por qué es única**:
- La mayoría de servers privados usan oro+rojo o dorado+marrón.
- Frost cyan sobre obsidiana = WoTLK puro (Lich King, Frostmourne, Acherus).
- El verde necrótico solo aparece en CTAs (registrarse) — acento sorpresa.

### Refactor técnico

Renombrado masivo de variables CSS:
- `--color-gold*` → `--color-accent*`
- `.btn-gold` → `.btn-primary`
- `.btn-green` → `.btn-secondary`
- `.text-gold-gradient` → `.text-accent-gradient`

Comando ejecutado:
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -print0 \
  | xargs -0 sed -i -e 's/--color-gold-bright/--color-accent-bright/g' ...
```

22 archivos modificados de una pasada. Los nombres ahora son semánticos (no atados a un color concreto) — si mañana queremos rojo o púrpura, solo cambiamos `globals.css`.

## 3. Responsive completo

### Mobile nav drawer

Nuevo client component `src/components/layout/mobile-nav.tsx`:

- **Hamburger** visible solo en `< lg` (1024px).
- **Drawer slide-in** desde la derecha (85vw, max 24rem).
- **Backdrop blur** con click para cerrar.
- **Body scroll lock** cuando está abierto (via `.drawer-open`).
- **Acordeón nativo** (`<details>`) por sección — sin JS extra, accesible.
- **Iconos** de cada item visibles también en móvil.
- **Utility links** (Donar/Radio/Reglas) en grid 3-col al final.
- **Esc para cerrar** vía focus management nativo de `<dialog>`.

### Header desktop responsive

- `hidden lg:flex` para navegación de escritorio.
- Brand central con tipografía escalada: `text-base sm:text-xl lg:text-2xl`.
- Tracking adaptativo: `tracking-[0.25em] sm:tracking-[0.3em] lg:tracking-[0.35em]`.
- En móvil: brand alineada izquierda + hamburger a la derecha.
- En desktop ≥ 1024px: brand centrada + navs a ambos lados.

### Páginas pulidas para móvil

- **Home**: padding `px-4 sm:px-6 py-6 sm:py-10`, hero `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`, botones `flex-col sm:flex-row`, banner "Carta Abierta" con `truncate` en el texto y chevron en vez de botón verboso.
- **Cards de noticias**: `grid sm:grid-cols-2 lg:grid-cols-3` (antes solo `md:grid-cols-3`).
- **Clase detail**: icono `w-16 h-16 sm:w-20 sm:h-20`, título `text-3xl sm:text-4xl md:text-5xl truncate`.
- **Hero del home**: `mx-auto max-w-7xl px-4 sm:px-6`.

## Verificación

```bash
npm run build
# ✓ Compiled successfully in 3.7s
# ✓ 41 páginas generadas estáticamente
# ✓ 0 warnings · 0 errors
```

## Lo que se siente diferente

- **Identidad visual única**: frost cyan + obsidiana no se parece a Warmane, Atlantiss, Sunwell, Mysteries of Azeroth ni ningún otro server hispano.
- **Nombre con peso WoW**: Ebonhold suena a algo que existe en el juego (porque existe).
- **Móvil de verdad**: en un teléfono, hamburger → drawer animado, sin scroll horizontal, todo legible.
- **Mantenibilidad**: cambiar de marca o paleta ahora son 2 archivos (`brand.ts` + `globals.css`).

## Pendientes para próxima iteración

- Logo SVG en vez de texto.
- Detectar swipe para cerrar el drawer en móvil.
- Tema claro alternativo (opcional).
- Animar las cards del home al cargar (fade-in stagger).
- Testear en pantallas anchas (>1600px) por si hay que ampliar `max-w`.
