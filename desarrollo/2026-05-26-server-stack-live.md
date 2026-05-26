# 2026-05-26 · Server stack live — MySQL + acore + ebonhold_web operativos

## Objetivo

Levantar la **tercera pata** del proyecto: el servidor. Sin atascos. Sin necesidad del cliente WoW para esta fase (solo lo necesitará el worldserver más tarde).

## Resultado

Stack de BD **100% operativo en local**:

| Componente | Estado | Notas |
|---|---|---|
| MySQL 8.0 | ✅ healthy | Puerto 3306 (127.0.0.1) |
| `acore_auth` | ✅ 18 tablas | + 3 realms personalizados |
| `acore_characters` | ✅ 106 tablas | Listo para personajes |
| `acore_world` | ✅ 298 tablas, ~235 MB | Seeds completos (NPCs, quests, items, scripts) |
| `ebonhold_web` | ✅ 8 tablas Drizzle | news, sessions, forum_*, donations, tickets, realm_stats |
| Authserver | ⏸ preparado | Solo falta arrancarlo |
| Worldserver | ⏸ pendiente cliente | Necesita maps/dbc/vmaps/mmaps del WoW client |

## Problema encontrado y resuelto

**Síntoma**: MySQL 8.4 entraba en restart loop con

```
unknown variable 'default-authentication-plugin=mysql_native_password'
```

**Causa**: MySQL 8.4 (release 2024) eliminó esta opción. AzerothCore necesita el plugin `mysql_native_password` para compatibilidad con el cliente del juego (autenticación binaria del protocolo).

**Fix**: pinear `mysql:8.0` en docker-compose. El plugin sigue disponible y AzerothCore conecta sin problemas.

```diff
- image: mysql:8.4
+ image: mysql:8.0
```

## Pasos ejecutados

1. **Verifiqué Docker** corriendo.
2. **Arranqué MySQL** → falló con error 8.4 → fix → arrancó OK.
3. **`docker compose run --rm ac-db-import`** en background → descarga imagen ~3.5 GB → crea las 3 BDs del core con seeds completos (~3 min).
4. **Ejecuté `init-web.sql`** → crea `ebonhold_web` + usuario dedicado con permisos mínimos.
5. **`drizzle-kit push`** desde `web/` → genera las 8 tablas del schema TS en MySQL real.
6. **Personalicé `acore_auth.realmlist`** con nuestros 3 reinos (Acherus PvE 8085, Wyrmrest PvP 8086, Crystalsong RP 8087).
7. **Test del pipeline completo** levantando `npm run dev` en `web/` y curl-eando los endpoints:

```bash
curl http://localhost:3000/api/realms
# {"realms":[{"id":"acherus","name":"Acherus",...},{"id":"wyrmrest",...},...]}

curl http://localhost:3000/api/news?limit=2
# {"items":[{...}],"total":9}
```

✅ Web ↔ BD ↔ acore conectados end-to-end.

## Helpers añadidos

### `server/start.ps1`

Script PowerShell idempotente:

```powershell
.\start.ps1              # MySQL + authserver (sin worldserver, no requiere cliente WoW)
.\start.ps1 -Full        # Todo (requiere cliente en client-data/)
.\start.ps1 -Reset       # Borra volúmenes y reinicia desde cero
```

Hace automáticamente:
1. Verifica Docker.
2. (Opcional) Reset.
3. Arranca MySQL y espera healthy con polling (max 60s).
4. Ejecuta `ac-db-import` (idempotente: solo aplica diffs).
5. Inicializa `ebonhold_web` si no existe + corre `drizzle-kit push`.
6. Arranca auth (y world si `-Full`).

### `server/stop.ps1`

Detiene todo preservando los volúmenes.

### `web/.env.local`

```env
DATABASE_URL="mysql://root:azerothcore@localhost:3306/ebonhold_web"
ACORE_DATABASE_URL="mysql://root:azerothcore@localhost:3306/"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Gitignored por la regla `.env*` (con override para `.env.example`).

## docker-compose actualizado

- `image: mysql:8.0` con comentario explicando el porqué (evita el error que ya pasamos).
- Resto sin cambios — la stack queda exactamente como se documentaba.

## README del server: rewrite completo

[`server/README.md`](../server/README.md) ahora cubre:
- TL;DR con los 3 comandos clave
- Tabla de estado por componente
- Setup paso a paso (con cliente y sin cliente)
- Crear cuenta GM (en worldserver)
- Crear cuenta vía SQL (limitación SRP6, plan futuro)
- Puertos
- Conexión desde la web
- Comandos útiles (logs, mysql, backup, sizes)
- **Troubleshooting** con tabla de errores comunes (incluyendo el MySQL 8.4)

## Próximos pasos lógicos

1. **Endpoint `POST /api/auth/register`** — hash SRP6 + INSERT en `acore_auth.account`. El launcher podrá registrar cuentas sin abrir navegador.
2. **Worldserver**: cuando tengas el cliente WoW 3.3.5a:
   - Copiar a `server/client-data/`
   - `docker compose --profile tools up ac-tools` (extrae 15-40 min)
   - `.\start.ps1 -Full`
3. **Cron job en Vercel** que rellena `realm_stats` cada 5 min consultando online players.
4. **Exponer la BD a Vercel en producción**: opciones documentadas en `docs/deploy-vercel.md` (Cloudflare Tunnel, PlanetScale, VPS).

## Verificación final

```
=== Resumen de BDs ===
BD                  tablas
acore_auth          18
acore_characters    106
acore_world         298
ebonhold_web        8

=== Realmlist ===
id  name
1   Acherus
2   Wyrmrest
3   Crystalsong
```

Todo verde. Sin atascos.
