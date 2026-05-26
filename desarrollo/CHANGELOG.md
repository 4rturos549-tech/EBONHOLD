# Changelog de Desarrollo

Bitácora del proyecto. Cada entrada es un hito o tarea completada. Esta carpeta también alimenta la sección "Desarrollo › Changelog" de la web.

Formato: el más reciente arriba.

---

## 2026-05-26 — 0.1.0 · APIs reales + primera release del launcher

- **API `/api/realms`** en la web: combina datos estáticos del config con jugadores online desde `acore_characters.characters` cuando hay BD conectada. CORS abierto, cache CDN 30s, fail-safe sin BD.
- **API `/api/news`**: lee los devlogs de `/desarrollo/` (single source of truth) y devuelve título + fecha + excerpt + URL. Query param `?limit=N`. Cache 5min.
- **Cliente HTTP del launcher** (`lib/api.ts`) con timeout 6s y graceful fallback.
- **`RealmStatus.tsx`** auto-refresca cada 30s.
- **`NewsList.tsx`** con skeleton loaders animados durante carga. Click en noticia abre el changelog en el navegador.
- **brand.ts** apunta a la URL real (`https://ebonhold.vercel.app`).
- Build verificado: web genera 43 rutas (41 estáticas + 2 funciones API), launcher sin errores.
- **🚀 Tag `launcher-v0.1.0`**: dispara la primera release pública vía GitHub Actions (instaladores Win/Mac/Linux con auto-update).
- Detalles ver [`2026-05-26-api-realms-news-release.md`](2026-05-26-api-realms-news-release.md).

## 2026-05-26 — 0.0.8 · Logo SVG profesional + iconos del instalador

- **Logo SVG rediseñado** con 13 capas vectoriales: halo radial, diamante exterior con bevel metálico, doble borde inner, cripta obsidiana, anillo decorativo, mini-diamantes, sparkles de 8 puntas, halo bajo el shard, shard con facetas y líneas de talla, núcleo brillante triple-circle, cardinales con glow.
- **Pipeline pure-JS de generación** de iconos: `@resvg/resvg-js` + `png2icons`. Sin deps nativas → funciona en CI.
- **Genera todos los formatos** desde un único SVG master:
  - `icon.ico` Windows multi-size (16/24/32/48/64/128/256, ~422 KB)
  - `icon.icns` macOS multi-size (16 hasta 1024, ~390 KB)
  - `icon.png` 512×512 Linux
  - `icon@1024.png` master para regenerar
- Script ejecutable con `npm run icons`.
- **Sincronizado** entre web y launcher: el mismo SVG master se embebe en `Logo.tsx` (web y launcher), `public/logo.svg`, `public/favicon.svg`.
- electron-builder ya estaba configurado para usar estos archivos → la próxima release del launcher tendrá iconos perfectos.
- Detalles ver [`2026-05-26-logo-pro-iconos.md`](2026-05-26-logo-pro-iconos.md).

## 2026-05-26 — 0.0.7 · Launcher Electron bootstrap

- **Launcher de escritorio** completo: Electron + Vite + React 19 + TS + Tailwind v4 (mismo stack que la web).
- **Arquitectura limpia** main/preload/renderer con tipos compartidos en `src/shared/`. BridgeAPI tipada end-to-end con contextBridge.
- **5 vistas**: Home (hero + botón JUGAR + noticias + estado de reinos), News, Patches, Settings (carpeta, idioma, updater), About.
- **Title bar custom** frameless con logo flotante, controles propios, drag region.
- **Botón JUGAR** verde con shimmer animado: escribe `realmlist.wtf` y lanza `Wow.exe`.
- **Persistencia local** de config en JSON en userData.
- **Auto-update** vía GitHub Releases con `electron-updater` apuntando a `4rturos549-tech/EBONHOLD`.
- **electron-builder** configurado para Windows (NSIS), macOS (DMG x64+arm64), Linux (AppImage).
- **GitHub Actions** workflow `launcher-release.yml` que builda los 3 OS en paralelo al hacer `git tag launcher-v*`.
- **Theme idéntico a la web**: frost cyan + obsidiana + verde necrótico. Logo SVG compartido. Animaciones reutilizadas (fade-in-up, logo-float, status-pulse) + nuevas (bg-pan, shimmer en botón JUGAR).
- Build verificado: ✓ main 6.58 KB, preload 1.39 KB, renderer 596 KB, sin errores TypeScript.
- Detalles ver [`2026-05-26-launcher-bootstrap.md`](2026-05-26-launcher-bootstrap.md).

## 2026-05-26 — 0.0.6 · Logo SVG + animaciones + BD + deploy a Vercel

- **Logo SVG propio**: diamante con cristal frost central tipo Frostmourne. Componente React parametrizable + favicon SVG.
- **Animaciones**: `fade-in-up` con stagger, `logo-float` con glow pulsante, `lift-on-hover` con curva spring, `status-pulse` para reinos online, underline animado para links. Respeta `prefers-reduced-motion`.
- **Base de datos completa**: Drizzle ORM + mysql2. Schema con 7 tablas (news, sessions, forum_*, donations, tickets, realm_stats). Cliente con connection pooling. Bridge opcional read-only hacia `acore_*` para realm status y registro.
- **Arquitectura BD**: 1 instancia MySQL con 4 BDs lógicas (`acore_auth/world/characters` + `ebonhold_web`). Init SQL con usuario dedicado y permisos mínimos. README con diagrama ASCII de conexiones.
- **Scripts NPM**: `db:generate`, `db:migrate`, `db:studio`, `db:push`.
- **Vercel-ready**: `vercel.json` en raíz + `docs/deploy-vercel.md` con guía paso a paso (subir a GitHub, env vars, dominio, auto-deploy, rollback, troubleshooting).
- Detalles ver [`2026-05-26-logo-animaciones-bd-deploy.md`](2026-05-26-logo-animaciones-bd-deploy.md).

## 2026-05-26 — 0.0.5 · Rebrand a Ebonhold + paleta frost + responsive completo

- **Rebrand**: "Masamune" → **EBONHOLD** (Ebon Hold/Acherus, necrópolis de los Caballeros de la Muerte en WoTLK). Tagline: *"La Ciudadela del Norte Helado"*.
- **Reinos renombrados** a locations reales de Rasganorte: Acherus (PvE), Wyrmrest (PvP), Crystalsong (RP).
- **Nueva paleta única**: frost cyan + obsidiana + verde necrótico. Inspirada en Frostmourne y la Plaga. Se diferencia de los servers que usan oro/dark fantasy.
- **Renombrado masivo de variables CSS** a nombres semánticos (`gold` → `accent`, `btn-gold` → `btn-primary`, etc) en 22 archivos. Cambiar paleta ahora = editar 1 archivo.
- **Mobile nav drawer**: hamburger + slide-in animado con backdrop blur, body lock, acordeón nativo `<details>`, iconos en cada item.
- **Header responsive** (`hidden lg:flex` para desktop, hamburger para móvil), brand con tipografía y tracking escalados.
- **Páginas optimizadas** para móvil: paddings escalonados, grids responsive, títulos con sizes adaptativos, banners con truncate.
- Detalles ver [`2026-05-26-ebonhold-rebrand-responsive.md`](2026-05-26-ebonhold-rebrand-responsive.md).

## 2026-05-25 — 0.0.4 · Pulido visual + iconos WoW + fix shift

- **Fix shift horizontal** entre páginas con `scrollbar-gutter: stable`.
- Theme pulido: gradientes en botones, hover glow, panel hover variant, divider ornamentado con ◆, nav items con underline animado, scrollbar dorada custom, focus visible accesible.
- **Lucide-react** integrado: iconos en navegación, dropdowns y botones.
- **Iconos oficiales de clases WoW** vía CDN de Wowhead (`wow.zamimg.com`).
- **Colores oficiales de clases** (códigos canónicos de Blizzard) aplicados a tarjetas y páginas individuales.
- Refactor de `NavDropdown` a 100% CSS (server component, cero JS al cliente).
- Detalles ver [`2026-05-25-pulido-visual.md`](2026-05-25-pulido-visual.md).

## 2026-05-25 — 0.0.3 · Marca "Masamune" + arquitectura limpia + 28 páginas

- Nombre del servidor: **MASAMUNE** — *El Filo Eterno de Azeroth*. Reinos nombrados como espadas legendarias: Frostmourne (PvE), Ashbringer (PvP), Quel'Delar (RP).
- Refactor completo a arquitectura limpia: separación `config/` + `components/{ui,layout,features}/` + `lib/`.
- 4 archivos de configuración como punto único de verdad: `brand.ts`, `nav.ts`, `realms.ts`, `classes.ts`.
- 5 primitives UI nuevos: Panel, Button, ButtonLink, Divider, PageHeader, ComingSoon.
- **28 páginas nuevas** creadas (todas las del menú + utilitarias).
- Página `/clases/[slug]` dinámica con `generateStaticParams` → 9 páginas estáticas para cada clase.
- `/desarrollo/changelog` **lee automáticamente** los devlogs de `/desarrollo` vía script `sync-content`.
- Markdown renderer minimal sin deps externas.
- Build verificado: ✓ 41 páginas estáticas, 0 warnings.
- Detalles ver [`2026-05-25-refactor-arquitectura.md`](2026-05-25-refactor-arquitectura.md).

## 2026-05-25 — 0.0.2 · Landing web inicial

- Bootstrap de Next.js 16 + Tailwind v4 + TypeScript en [`web/`](../web/).
- Tema visual dark fantasy con paleta dorada (estilo Mysteries of Azeroth).
- Componentes base creados:
  - `SiteHeader` con navegación principal y dropdowns por hover.
  - `NavDropdown` (client component) — abre/cierra al pasar el ratón.
  - `SiteFooter` con aviso legal sobre marca Blizzard.
  - `RealmStatus` con 3 reinos placeholder (Nordanaar, Tel'Abim, Ambershire).
- Página `/` con banner de carta abierta, hero principal, sidebar (registro + Discord + estado de reinos) y grid de noticias.
- Fuentes: **Cinzel** (display) + **Inter** (texto) vía `next/font/google`.
- Build de producción verificado: ✓ compila sin errores, ✓ TypeScript sin errores, ✓ páginas pre-renderizadas estáticamente.
- Detalles ver [`2026-05-25-landing-web.md`](2026-05-25-landing-web.md).

## 2026-05-25 — 0.0.1 · Inicio del proyecto

- Estructura del monorepo creada: `web/`, `launcher/`, `server/`, `client-patches/`, `desarrollo/`, `docs/`.
- README raíz con visión general del stack.
- `.gitignore` raíz cubriendo Node, env, builds, datos del cliente WoW y secretos.
- `server/docker-compose.yml` preparado con AzerothCore (authserver + worldserver + MySQL + tools) usando imágenes oficiales `acore/ac-wotlk-*:14.0.0-dev`. Listo para arrancar cuando Docker Desktop esté corriendo y haya un cliente 3.3.5a disponible.
- `server/README.md` con guía paso a paso de instalación local.
- Detalles ver [`2026-05-25-inicio-proyecto.md`](2026-05-25-inicio-proyecto.md).
