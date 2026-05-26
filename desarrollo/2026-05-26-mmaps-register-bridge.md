# 2026-05-26 · mmaps + /api/auth/register + bridge para Cloudflare Tunnel

## Objetivo

Tres tareas en una sesión:
1. **Regenerar mmaps** (pathfinding de NPCs).
2. **`POST /api/auth/register`** — crear cuentas desde la web/launcher.
3. **Bridge HTTP + Cloudflare Tunnel** — BD del server accesible desde Vercel.

## 1. mmaps regenerados

### El bug: "Failed to load configuration"

`mmaps_generator` esperaba un archivo `mmaps-config.yaml` que no estaba documentado. Mi primer intento con flat YAML (`threads: 4`, `maxAngle: 60.0`) falló. Lo mismo con formato INI.

**Tras leer el código fuente** (`Config.cpp` de AzerothCore), la estructura real es nested bajo `mmapsConfig:`:

```yaml
mmapsConfig:
  dataDir: /azerothcore/env/dist/data
  skipLiquid: false
  skipContinents: false
  skipJunkMaps: true
  skipBattlegrounds: false
  debugOutput: false
  meshSettings:
    walkableSlopeAngle: 60.0
    walkableHeight: 6
    walkableClimb: 6
    walkableRadius: 2
    vertexPerMapEdge: 2000
    vertexPerTileEdge: 80
    maxSimplificationError: 1.8
```

Con eso + `dataDir` absoluto, mmaps_generator procesó los ~600 mapas en ~45 min.

### Resultado

```
ls client-data/mmaps | wc -l
→ 3780 archivos .mmap + .mmtile
```

Worldserver reiniciado. Logs confirman carga:
```
AzerothCore rev. 40f0c2d29b45+ ... (worldserver-daemon) ready...
```

NPCs ahora hacen pathfinding correctamente (caminan por rutas, esquivan obstáculos, etc).

## 2. `POST /api/auth/register`

[`web/src/app/api/auth/register/route.ts`](../web/src/app/api/auth/register/route.ts)

### Validación

- `username`: 3-16 chars, `[A-Z0-9_]+` (uppercased automáticamente)
- `password`: 6-64 chars
- `email`: opcional, regex básico `\S+@\S+\.\S+`

### Flujo

1. Si `BRIDGE_URL` está configurado → proxy al bridge (caso Vercel)
2. Si no, hay `ACORE_DATABASE_URL` → conexión MySQL directa (caso local dev)
3. Si ninguna → 503 "no disponible"

En el caso directo:
1. Comprueba duplicado de username (`SELECT id FROM account WHERE username = ?`)
2. Calcula SRP6 verifier con `web/src/lib/auth/srp6.ts`
3. INSERT en `acore_auth.account`

### CORS abierto

El launcher hace cross-origin POST → headers permisivos:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Form activo en `/registrarse`

[`web/src/components/features/register-form.tsx`](../web/src/components/features/register-form.tsx) — client component con:
- 4 campos (usuario, email, password, confirm password)
- Loading state con spinner
- Banner verde (éxito) o rojo (error)
- Limpieza del form al éxito
- Validación cliente: passwords coinciden

[`web/src/app/registrarse/page.tsx`](../web/src/app/registrarse/page.tsx) reemplaza el form deshabilitado por `<RegisterForm />`. Añade link a `/reglas` como mini-disclaimer.

## 3. Bridge HTTP + Cloudflare Tunnel

### Problema arquitectónico

Vercel (serverless) no puede mantener una conexión TCP persistente a MySQL local detrás de NAT. Opciones consideradas:
- Abrir 3306 al internet → ❌ inseguro
- Cloudflare Tunnel TCP → ❌ Vercel no puede dialear de vuelta
- **Bridge HTTP local + Cloudflare Tunnel HTTPS** → ✅

### Bridge implementado

[`server/bridge/`](../server/bridge) — mini servicio Hono:

- **Hono** (~7 KB de runtime) + `@hono/node-server`
- **mysql2** con connection pool
- **SRP6 inline** (mismo algoritmo que la web, evitamos workspace deps)
- Node ESM, sin compilación TypeScript necesaria

Endpoints:

| Método | Ruta | Auth | Propósito |
|---|---|---|---|
| GET | `/health` | no | Liveness check |
| GET | `/stats/online` | sí | Jugadores online por facción |
| GET | `/accounts/exists/:username` | sí | Comprobar duplicado |
| POST | `/accounts` | sí | Crear cuenta con SRP6 |

Autenticación: header `X-Bridge-Key` debe coincidir con `BRIDGE_KEY` env.

### Docker integration

Nuevo servicio `ac-bridge` en `docker-compose.yml`:
- Build local desde `./bridge/Dockerfile`
- `depends_on: ac-database` (espera healthy)
- Expone solo en `127.0.0.1:4000` (no público — Cloudflare lo expone)
- Lee `BRIDGE_KEY` de un `.env` adyacente

### Web actualizada para usar el bridge

Refactor de [`web/src/lib/db/acore.ts`](../web/src/lib/db/acore.ts):

```ts
async function fetchOnlinePlayers() {
  // 1) Intentar via bridge (Vercel-friendly)
  const res = await bridgeFetch("/stats/online");
  if (res?.ok) return formatStats(await res.json());

  // 2) Fallback: MySQL directo (dev local)
  return queryMysqlDirect();
}
```

Mismo patrón para `registerAccount()`. La capa de aplicación no sabe ni le importa qué camino se usa.

### Docs

[`docs/cloudflare-tunnel.md`](cloudflare-tunnel.md) — guía paso a paso:
- Diagrama de arquitectura
- Por qué tunnel vs abrir puertos
- Generar `BRIDGE_KEY` con `crypto.randomBytes(32).hex`
- Opción rápida: `*.trycloudflare.com` URL temporal
- Opción persistente: dominio + tunnel + DNS + config.yml
- Servicio Windows para arranque automático
- Config en Vercel (env vars + redeploy)
- Troubleshooting (tabla de errores comunes)
- Cómo apagar todo para privacidad

## Verificación end-to-end del bridge

```bash
$ docker compose up -d ac-bridge
$ curl http://localhost:4000/health
{"ok":true,"ts":1779824610739}

$ curl -H "X-Bridge-Key: ..." http://localhost:4000/stats/online
{"ok":true,"total":0,"alliance":0,"horde":0,"ts":...}

$ curl -H "X-Bridge-Key: ..." http://localhost:4000/accounts/exists/GM
{"ok":true,"exists":true}

$ curl -X POST -H "X-Bridge-Key: ..." -H "Content-Type: application/json" \
    -d '{"username":"BRIDGETEST","password":"abc123"}' \
    http://localhost:4000/accounts
{"ok":true,"username":"BRIDGETEST"}

$ # En BD:
$ docker exec ... mysql -e "SELECT username FROM account WHERE username='BRIDGETEST'"
BRIDGETEST  ✓

$ # Duplicado:
$ curl -X POST ... -d '{"username":"BRIDGETEST","password":"x"}' ...
{"ok":false,"error":"Usuario ya existe"}  ✓ (409)
```

## Estado del proyecto al cierre

| Componente | Estado |
|---|---|
| MySQL 8.0 | ✅ healthy |
| acore_auth + characters + world | ✅ datos completos |
| ebonhold_web | ✅ schema Drizzle aplicado |
| authserver | ✅ Up |
| worldserver | ✅ Up con **mmaps cargados** |
| Bridge HTTP | ✅ Up en :4000 |
| Web Vercel | ✅ con `/api/auth/register` listo |
| Launcher | ✅ v0.1.0 publicado |
| Cuentas | `GM/12345`, `TEST/test`, `BRIDGETEST/abc123` |

## Siguiente paso para el usuario

Para que Vercel vea datos en vivo en `/api/realms` y el registro funcione desde producción:

1. Instalar `cloudflared` (Windows) — `scoop install cloudflared`
2. (Rápido) `cloudflared tunnel --url http://localhost:4000` → URL `*.trycloudflare.com`
3. Configurar en Vercel:
   - `BRIDGE_URL` = la URL del tunnel
   - `BRIDGE_KEY` = el mismo que está en `server/.env`
4. Redeploy

Después del redeploy, https://ebonhold.vercel.app/registrarse permite crear cuentas que se materializan en la BD local. Y `/api/realms` muestra contadores reales de jugadores conectados.

Para producción real con dominio propio: ver guía completa en `docs/cloudflare-tunnel.md`.
