# 2026-05-26 · APIs reales + primera release del launcher

## Objetivo

1. Crear los **endpoints de la web** que va a consumir el launcher (`/api/realms`, `/api/news`).
2. Conectar el launcher para que use esos endpoints en vez de placeholders.
3. **Disparar la primera release pública** del launcher (`launcher-v0.1.0`).

## API: `/api/realms`

[`web/src/app/api/realms/route.ts`](../web/src/app/api/realms/route.ts)

Devuelve el estado en vivo de los reinos, combinando:
- **Datos estáticos** del config (`web/src/config/realms.ts`) — nombre, tipo, descripción.
- **Datos dinámicos** de `acore_characters.characters` cuando hay BD conectada.

### Comportamiento
- Si `ACORE_DATABASE_URL` está configurado: consulta jugadores online por facción, marca el reino como `online` si hay > 0 jugadores.
- Si no está configurado: devuelve todos `offline` con 0 jugadores → la web/launcher no se rompen.

### Response
```json
{
  "realms": [
    {
      "id": "acherus",
      "name": "Acherus",
      "type": "PvE",
      "status": "online",
      "players": 142,
      "population": "media",
      "alliance": 78,
      "horde": 64
    }
  ],
  "lastUpdate": "2026-05-26T12:34:56Z"
}
```

### Caching
- `revalidate = 30` → CDN cache 30s
- `Cache-Control: s-maxage=30, stale-while-revalidate=60`
- `Access-Control-Allow-Origin: *` (el launcher hace cross-origin)

## API: `/api/news`

[`web/src/app/api/news/route.ts`](../web/src/app/api/news/route.ts)

Devuelve las últimas entradas del changelog de `/desarrollo`. **Misma fuente** que `/desarrollo/changelog` en la web — single source of truth.

### Query params
- `?limit=N` (default 10, max 50)

### Response
```json
{
  "items": [
    {
      "id": "logo-pro-iconos",
      "slug": "logo-pro-iconos",
      "title": "Logo SVG profesional + iconos del instalador",
      "date": "2026-05-26",
      "excerpt": "Subir el listón visual del logo (más detalle, mejores gradientes...)",
      "url": "https://ebonhold.vercel.app/desarrollo/changelog"
    }
  ],
  "total": 8
}
```

### Caching
- `revalidate = 300` → CDN cache 5min
- `Cache-Control: s-maxage=300, stale-while-revalidate=600`
- CORS abierto

### Cómo funciona internamente
1. `getChangelogEntries()` lee `web/content/desarrollo/*.md` (sincronizado por `prebuild`).
2. Por cada archivo: extrae fecha del slug, título del primer `#`, excerpt eliminando markdown y truncando a 220 chars.
3. Sort descendente por fecha, slice a `limit`.

## Launcher: cliente HTTP

[`launcher/src/renderer/lib/api.ts`](../launcher/src/renderer/lib/api.ts)

- `fetchRealms()` y `fetchNews(limit)`
- Timeout de **6 segundos** vía `AbortController`
- **Fail-safe**: si la web está caída o sin red, retorna array vacío en vez de lanzar excepción → el launcher sigue usable
- Type-safe end-to-end con interfaces `ApiRealm` y `ApiNewsItem`

## Componentes conectados

### `RealmStatus.tsx`
- Fetch inicial al montar
- **Auto-refresh cada 30s** con `setInterval`
- Cleanup correcto en unmount (`alive` flag + clearInterval)
- Estado "cargando…" sutil mientras llega la primera respuesta
- Si no hay datos: usa fallback con los 3 reinos del config marcados offline

### `NewsList.tsx`
- Fetch al montar
- **Skeleton loaders** animados (3 cards con barras pulsantes) durante la carga
- Mensaje "verifica tu conexión" si no llega nada
- Cada card es **clickeable**: abre el changelog de la web en el navegador del sistema (`window.api.app.openExternal`)
- Fechas formateadas en `es-ES`

## Verificación

```bash
cd web
npm run build
# ✓ 43 páginas (41 estáticas + 2 funciones API)
# ƒ /api/news
# ƒ /api/realms

cd ../launcher
npm run build
# ✓ main + preload + renderer 3.5s
npm run typecheck
# ✓ sin errores
```

## Primera release del launcher: `launcher-v0.1.0`

Con APIs conectadas y iconos generados, todo está listo para la primera release pública.

### Pipeline disparado por tag

```bash
git tag launcher-v0.1.0
git push origin launcher-v0.1.0
```

GitHub Actions (workflow `.github/workflows/launcher-release.yml`):

1. Detecta el tag `launcher-v*`
2. Spawn 3 runners en paralelo: `windows-latest`, `macos-latest`, `ubuntu-latest`
3. Cada uno:
   - `npm ci` en `launcher/`
   - `npm run build` (Vite compila main/preload/renderer)
   - `electron-builder --publish always` (empaqueta + sube a GitHub Releases)
4. Tiempo total: ~6-10 minutos

### Output esperado en GitHub Releases

- `Ebonhold Launcher-Setup-0.1.0.exe` (Windows NSIS, ~85 MB)
- `Ebonhold Launcher-0.1.0.dmg` (macOS x64 + arm64, ~95 MB c/u)
- `Ebonhold Launcher-0.1.0.AppImage` (Linux x64, ~90 MB)
- `latest.yml`, `latest-mac.yml`, `latest-linux.yml` (metadata para electron-updater)

A partir de aquí, **futuros tags `launcher-vX.Y.Z` lanzan auto-update** en todos los launchers ya instalados.

## Próximos pasos

1. **Cuando el server WoW esté arrancado**: configurar `ACORE_DATABASE_URL` en Vercel → automáticamente los reinos pasan a "online" con counts reales.
2. **Endpoint de registro** (`POST /api/auth/register`) con hash SRP6 → permite crear cuentas desde el launcher sin abrir navegador.
3. **Push notifications** desde el launcher cuando hay nuevas noticias.
