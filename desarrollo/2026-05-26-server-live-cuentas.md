# 2026-05-26 · Worldserver vivo + cuentas creadas vía SRP6

## Hito principal

**El servidor de juego está corriendo.** Después de extraer los datos del cliente WoW y crear cuentas con hash SRP6 correcto, ya se puede conectar el cliente y entrar al juego.

```
azerothcore-mysql        Up (healthy)        127.0.0.1:3306
azerothcore-authserver   Up                  0.0.0.0:3724
azerothcore-worldserver  Up                  0.0.0.0:8085, 0.0.0.0:7878
                         "AzerothCore ... ready..."
                         "WORLD: World Initialized In 0 Minutes 18 Seconds"
```

## Pasos ejecutados

### 1. Extracción del cliente WoW (1h)

`docker compose --profile extract up -d ac-extract` corrió las 4 fases:

- ✅ **map_extractor** → `dbc/`, `maps/`, `Cameras/`
- ✅ **vmap4_extractor** → `Buildings/`
- ✅ **vmap4_assembler** → `vmaps/`
- ⚠️ **mmaps_generator** → falló por falta de `mmaps-config.yaml` (pendiente, ver abajo)

**Aprendizaje**: en Git Bash en Windows hay que prefijar con `MSYS_NO_PATHCONV=1` los comandos `docker` con paths absolutos `/...`, o las rutas se traducen mal.

### 2. mmaps falló pero el server arranca igual

mmaps_generator necesita un archivo de config que no viene en la imagen tools. La pathfinding de NPCs queda degradada pero **el server arranca y funciona**. Es regenerable después sin parar nada.

Solución pendiente: crear `mmaps-config.yaml` con valores por defecto y rerun (5-10 min más). Tarea no urgente.

### 3. Arranque del stack completo

```powershell
docker compose up -d ac-authserver ac-worldserver
```

- Authserver: copió configs, inició listener en 3724.
- Worldserver: cargó `acore_world` (298 tablas), inicializó en 18s, mensaje `ready...`.

### 4. Sistema de cuentas SRP6

AzerothCore usa **SRP6 (Secure Remote Password)** para auth, no hashes simples. No se puede `INSERT` directo en `acore_auth.account` sin calcular `salt` + `verifier` correctos.

Creado [`web/src/lib/auth/srp6.ts`](../web/src/lib/auth/srp6.ts) — implementación pura (sin deps) del algoritmo:

```
salt = random(32 bytes)
h1   = SHA1(upper(user) + ":" + upper(pass))
h2   = SHA1(salt || h1)
x    = bigint(h2 little-endian)
v    = g^x mod N        # g=7, N constante de WoW
```

Parámetros tomados del source del core (`src/server/authserver/Server/AuthSession.cpp`).

Y [`web/scripts/create-account.mjs`](../web/scripts/create-account.mjs) — CLI que usa el algoritmo + `mysql2` para INSERT:

```powershell
cd D:\wow\web
node scripts/create-account.mjs <username> <password> [gmlevel]
```

`gmlevel`: 0=jugador, 1=mod, 2=GM, 3=admin.

### 5. Cuentas creadas

```
id  username  gmlevel
1   GM        3       (admin)
2   TEST      0       (jugador)
```

## Cómo conectarse desde el cliente

1. En el cliente WoW 3.3.5a: editar `Data/esMX/realmlist.wtf` (locale del cliente del usuario):
   ```
   set realmlist 127.0.0.1
   ```
2. Lanzar `Wow.exe`.
3. Login con `GM` / `12345`.
4. Verás 3 reinos disponibles: **Acherus**, Wyrmrest, Crystalsong. Selecciona Acherus (el único con worldserver corriendo, puerto 8085).

> Wyrmrest y Crystalsong están en realmlist apuntando a puertos 8086/8087 pero no hay worldserver corriendo ahí todavía → aparecerán como offline en el selector.

## Cómo usar la cuenta GM

Una vez dentro del juego, escribir en el chat:
```
.gm on            # activa modo GM
.tele <zona>      # teletransporte
.modify level 80  # subir a nivel 80
.additem <id> <count>
```

## Archivos creados/modificados

- `web/src/lib/auth/srp6.ts` — utility tipada (futuro `/api/auth/register` la usará)
- `web/scripts/create-account.mjs` — CLI standalone con SRP6 inline
- `server/docker-compose.yml` — servicio `ac-extract` con perfil `extract`
- `server/start.ps1` — flag `-Extract` añadida, detección idempotente

## Pendientes

1. **Regenerar mmaps**: crear `mmaps-config.yaml` y rerun. Mejora pathfinding NPCs.
2. **Endpoint `POST /api/auth/register`** — exponer la función SRP6 ya hecha vía HTTP.
3. **Worldservers para Wyrmrest y Crystalsong** — opcional, requiere más recursos.
4. **Cuando exponga la BD a Vercel**: las APIs en producción mostrarán datos reales (jugadores online, etc).

## Próximos pasos lógicos

- Conectar tu cliente WoW y comprobar que entras al juego.
- Una vez verificado, lanzar `git tag launcher-v0.1.1` cuando queramos sacar release del launcher con el cambio del realmlist a IP pública.
- Exponer la BD a internet (Cloudflare Tunnel o VPS) para que la web en Vercel pueda consumir datos en vivo.
