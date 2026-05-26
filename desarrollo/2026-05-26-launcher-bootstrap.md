# 2026-05-26 · Launcher Electron bootstrap

## Objetivo

Construir el **launcher de escritorio oficial de Ebonhold** desde cero. Mismo nivel de calidad visual que la web, arquitectura escalable, auto-update vía GitHub Releases, listo para release.

## Stack elegido

| Capa | Tech | Por qué |
|---|---|---|
| Build tool | **electron-vite** | Vite con presets para Electron, hot-reload de main + renderer, sin config compleja |
| Empaquetado | **electron-builder** | Estándar de facto, soporta NSIS (win), DMG (mac), AppImage (linux), integración con auto-update |
| Auto-update | **electron-updater** | Provider GitHub: subes un tag → todos los launchers actualizan |
| Renderer | **React 19 + TS + Tailwind v4** | Mismo stack que la web → componentes y tokens compartibles |
| Iconos | **lucide-react** | Mismos que la web → consistencia visual |
| IPC | **contextBridge tipado** | `window.api.*` con TypeScript, sin `any` |

> Consideré Tauri (~5MB vs ~100MB) pero electron-updater + GitHub Releases en monorepo es más maduro en Electron. Si en el futuro queremos ligereza, migrar a Tauri es viable porque la UI es 100% web estándar.

## Arquitectura

Tres procesos separados, tipos compartidos entre ellos:

```
launcher/src/
├── main/                Proceso Node de Electron
│   ├── index.ts         Entry: single instance lock, lifecycle
│   ├── window.ts        BrowserWindow frameless, dev/prod URL
│   ├── ipc.ts           Handlers: window controls, game launch, config, picker
│   ├── config.ts        Persistencia JSON en userData
│   └── updater.ts       electron-updater + IPC
├── preload/             Bridge seguro main↔renderer
│   └── index.ts         contextBridge.exposeInMainWorld("api", ...)
├── shared/              Tipos compartidos (importable por ambos)
│   ├── types.ts         BridgeAPI, Realm, LauncherConfig, UpdateInfo
│   └── brand.ts         Identidad (espejo de web/src/config/brand.ts)
└── renderer/            React SPA
    ├── App.tsx          Router simple por estado (5 vistas)
    ├── components/
    │   ├── ui/Logo.tsx          Diamante frost (idéntico a la web)
    │   ├── layout/TitleBar.tsx  Barra superior custom (frameless)
    │   ├── layout/Sidebar.tsx   Navegación lateral
    │   └── features/
    │       ├── RealmStatus.tsx
    │       └── NewsList.tsx
    ├── pages/
    │   ├── Home.tsx       Hero + botón Jugar + noticias + sidebar
    │   ├── News.tsx       Todas las noticias
    │   ├── Patches.tsx    Estado del cliente (futuro: descargas)
    │   ├── Settings.tsx   Carpeta del juego, idioma, updater manual
    │   └── About.tsx      Versión, créditos, links
    └── styles/globals.css Theme Ebonhold (cyan + obsidiana)
```

### Patrón IPC tipado

`src/shared/types.ts` define `BridgeAPI`. El preload lo implementa, el renderer lo consume:

```ts
// preload
contextBridge.exposeInMainWorld("api", {
  game: { launch: (cfg) => ipcRenderer.invoke("game:launch", cfg) },
  ...
} as BridgeAPI);

// renderer
const result = await window.api.game.launch({ realmlist: "play.ebonhold.com" });
//                                ^^^^^^ autocompleta, type-safe end-to-end
```

Si añades un método nuevo, los 3 puntos (types/preload/handler) deben actualizarse o TypeScript se queja → imposible romper el contrato silenciosamente.

## Características implementadas

### 1. Title bar custom (frameless)

Window sin marco nativo, dibujada por React. Permite:
- Branding consistente con la web (logo + nombre + versión en la barra)
- Drag region declarada con `-webkit-app-region: drag`
- Botones minimizar/maximizar/cerrar con hover (rojo para cerrar)

### 2. Sidebar con 5 vistas + acceso rápido

Navegación basada en estado. Items con indicador lateral cyan brillante cuando activos. Footer con botones a Web y Discord (abren navegador del sistema).

### 3. Vista Home con botón JUGAR

Dos estados:

**Sin cliente configurado**: muestra CTA "Seleccionar carpeta". Abre dialog nativo de Electron. Verifica que existe `Wow.exe`. Guarda la ruta en config local.

**Con cliente configurado**: muestra ruta + botón **JUGAR** verde con efecto shimmer animado. Al pulsar:
1. Escribe `realmlist.wtf` en `Data/esES/realmlist.wtf` (o enUS según idioma)
2. Lanza `Wow.exe` con `spawn` detached
3. Estado "Lanzando…" temporal

Hero con logo flotante grande + branding + tagline.

### 4. Persistencia local

Config en `app.getPath("userData")/launcher-config.json`. Campos:
- `gamePath` — carpeta del juego
- `username` — para auto-login (futuro)
- `windowMode` — windowed/fullscreen/borderless
- `language` — esES/enUS para realmlist.wtf

### 5. Auto-update vía GitHub Releases

`electron-updater` configurado con provider GitHub apuntando a `4rturos549-tech/EBONHOLD`. Flujo:

1. Al arrancar (producción), chequea silenciosamente.
2. Si hay update: notifica al renderer vía IPC.
3. Usuario decide cuándo descargar (Settings → "Buscar actualizaciones").
4. Progreso reportado en tiempo real.
5. Instala al cerrar la app.

### 6. Settings funcionales

- Cambiar carpeta del juego.
- Cambiar idioma del cliente (afecta dónde se escribe realmlist).
- Chequear actualizaciones manualmente.

### 7. About / créditos

Logo grande con float, versión actual, links a web/Discord/GitHub, disclaimer de Blizzard.

## Theme visual

Misma paleta que la web (`globals.css` con tokens espejados):

- Background: `#07101a` (obsidiana)
- Accent: `#6ec8f0` (frost cyan)
- Secondary: `#6dbe5e` (necrótico, usado en el botón JUGAR)
- Texto: `#e2e8f0` (bone)

### Botón JUGAR

Tratamiento especial:
- Gradiente verde de 3 stops
- Border verde brillante
- Inner highlight + inner shadow
- Glow exterior verde
- Animación shimmer (línea brillante que cruza el botón en hover)
- Sombra debajo al pulsar

### Hero background animado

Tres gradientes radiales que se mueven lentamente con `animation: bg-pan 30s ease-in-out infinite alternate` + `filter: blur(20px)`. Da sensación de "estamos en un lugar mágico" sin distraer.

### Animaciones

Reutilizadas de la web + añadidas específicas:
- `fade-in-up` con stagger en sidebar items y secciones.
- `logo-float` en el logo (4s loop).
- `status-pulse` en el dot verde de reinos online.
- `bg-pan` en el hero.
- `shimmer` en el botón JUGAR.
- Respeto a `prefers-reduced-motion`.

## CI/CD

`.github/workflows/launcher-release.yml`:

- Trigger: tag `launcher-v*` (separado de la web para releases independientes)
- Matrix: Windows + macOS + Ubuntu en paralelo
- Cada uno builda + empaqueta + publica al release de GitHub
- `GH_TOKEN` automático (provee GitHub Actions)

Para sacar una versión:
```powershell
# 1. Bump version en launcher/package.json
# 2. Commit + tag
git tag launcher-v0.1.0
git push --tags
# 3. CI hace el resto (3-8 minutos por OS)
```

## Verificación

```bash
cd launcher
npm install              # 374 packages, 30s
npm run build            # ✓ main + preload + renderer en <4s
npm run typecheck        # ✓ sin errores en tsconfig.node ni tsconfig.web
```

Tamaños del build:
- main: 6.58 KB
- preload: 1.39 KB
- renderer: 596 KB JS + 26 KB CSS (incluye React, lucide, tailwind compilado)

## Cómo probarlo

```powershell
cd D:\wow\launcher
npm run dev
```

Abre una ventana de Electron con el launcher real, hot-reload activo en main y renderer.

## Pendientes próximas iteraciones

- **Iconos del instalador**: necesitamos `resources/icon.ico`, `icon.icns`, `icon.png` para que electron-builder los embeba en los instaladores. Se generan desde el logo SVG (hay tools online o `electron-icon-builder`).
- **News/Realms reales**: actualmente placeholders. Cuando la web tenga `/api/news` y `/api/realms`, conectar.
- **Patches**: descarga y verificación de MPQs desde Cloudflare R2.
- **Login integrado**: form de credenciales que valida contra `acore_auth` antes de lanzar.
- **Atajos de teclado**: F5 lanzar, Ctrl+, settings, etc.
- **Tray icon**: minimizar a bandeja al cerrar.
- **Firma del instalador** (Windows): code-signing certificate para evitar el warning de SmartScreen.

## Mostrarle al server cuando esté arrancado

El launcher consume estos endpoints (futuros):
- `GET https://ebonhold.vercel.app/api/realms` — estado en vivo
- `GET https://ebonhold.vercel.app/api/news?limit=5` — últimas noticias
- `POST https://ebonhold.vercel.app/api/auth/register` — crear cuenta sin abrir navegador

La web ya tiene la BD configurada para esos endpoints. Solo falta implementar las route handlers.
