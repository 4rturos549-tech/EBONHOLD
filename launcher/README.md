# Ebonhold Launcher

Launcher de escritorio oficial para Ebonhold (WoTLK 3.3.5a). Construido con Electron + Vite + React + TypeScript + Tailwind v4.

## Características

- **Lanzar el juego** con realmlist preconfigurado, en un clic.
- **Estado de reinos** en tiempo real (consume `/api/realms` de la web).
- **Noticias** integradas desde la web.
- **Auto-update** vía GitHub Releases — `git tag v0.2.0 && git push --tags` y todos los launchers se actualizan solos.
- **Title bar custom** con controles de ventana propios.
- **Persistencia local** de config (carpeta del juego, idioma, etc.).
- **Mismos colores y animaciones** que la web para identidad consistente.

## Stack

| Capa | Tech |
|---|---|
| Build | electron-vite (vite con presets para Electron) |
| Empaquetado | electron-builder (NSIS Windows, DMG mac, AppImage Linux) |
| Auto-update | electron-updater (GitHub provider) |
| Renderer | React 19 + TypeScript + Tailwind v4 |
| Iconos | lucide-react |
| IPC | contextBridge tipado (`window.api.*`) |

## Desarrollo

```powershell
cd D:\wow\launcher
npm install
npm run dev      # abre el launcher con hot-reload de main y renderer
```

## Build (testing local)

```powershell
npm run build:win
# Output: release/0.1.0/Ebonhold Launcher-Setup-0.1.0.exe
```

## Release (sube a GitHub)

```powershell
# 1. Sube version en package.json (e.g. "0.1.0" -> "0.2.0")
# 2. Commit + tag
git commit -am "chore(launcher): v0.2.0"
git tag launcher-v0.2.0
git push --tags
# 3. GitHub Actions construye los 3 OS y publica el release con auto-update
```

> Necesitas `GH_TOKEN` con permisos `repo` para que `electron-updater` pueda leer releases privados.
> Si el repo es público, no hace falta token en runtime — solo en build (la CI lo provee).

## Arquitectura

```
launcher/
├── src/
│   ├── main/             Proceso principal (Node)
│   │   ├── index.ts      Entry point
│   │   ├── window.ts     BrowserWindow setup
│   │   ├── ipc.ts        Handlers IPC
│   │   ├── config.ts     Persistencia local
│   │   └── updater.ts    electron-updater
│   ├── preload/          Bridge seguro main↔renderer
│   │   └── index.ts      Expone window.api con contextBridge
│   ├── shared/           Tipos compartidos
│   │   ├── types.ts      BridgeAPI, Realm, Config, etc.
│   │   └── brand.ts      Identidad (sincronizada con web)
│   └── renderer/         UI React
│       ├── App.tsx       Router simple (5 vistas)
│       ├── components/
│       │   ├── ui/       Logo, etc.
│       │   ├── layout/   TitleBar, Sidebar
│       │   └── features/ RealmStatus, NewsList
│       ├── pages/        Home, News, Patches, Settings, About
│       └── styles/
│           └── globals.css  Theme Ebonhold (frost cyan + obsidiana)
├── electron.vite.config.ts
├── electron-builder.yml
├── resources/            Iconos (se generaran)
└── out/                  Build output (gitignored)
```

## Seguridad

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: false` (necesario para preload con import statements)
- Solo APIs explícitamente expuestas en preload via `contextBridge`
- Links externos abren en navegador del sistema (nunca en webContents)
- `requestSingleInstanceLock` previene múltiples instancias
