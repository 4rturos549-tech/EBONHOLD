# 2026-05-26 · Launcher con registro + /login web + plan cloud Oracle Free Tier

## Objetivo

1. Vista de **registro en el launcher** (sin abrir navegador).
2. **`/login`** real en la web con verificación SRP6.
3. Guía completa para mover TODO a **Oracle Cloud Free Tier** (24/7, gratis, sin PC encendido).

## 1. Launcher: vista de registro

[`launcher/src/renderer/pages/Register.tsx`](../launcher/src/renderer/pages/Register.tsx)

- Form con 4 campos (usuario, email, password, confirm).
- Validación cliente (passwords coinciden) + server (regex, longitud).
- Hace **fetch directo** al endpoint público:
  `https://ebonhold.vercel.app/api/auth/register`
- La web a su vez proxy-a al bridge → el launcher NUNCA conoce el `BRIDGE_KEY`.
- Estados: loading con spinner, banner verde/rojo.
- Sidebar item nuevo "Crear cuenta" con icono `UserPlus`.

### Por qué pasar por la web pública y no llamar al bridge directo

Si el launcher llamara al bridge directamente, necesitaría el `BRIDGE_KEY` embebido en el binario → cualquier usuario que decompile el .exe lo extrae → un atacante podría spamear cuentas.

Al ir por `web → bridge`, el key vive solo en Vercel (entorno cerrado). Vercel también puede hacer rate-limiting, captcha, etc. en el futuro.

## 2. Web `/login` con verificación SRP6 real

[`web/src/app/api/auth/login/route.ts`](../web/src/app/api/auth/login/route.ts)
[`web/src/components/features/login-form.tsx`](../web/src/components/features/login-form.tsx)
[`web/src/app/login/page.tsx`](../web/src/app/login/page.tsx)

### Cómo verificar SRP6 sin replicar todo el handshake

AzerothCore guarda `salt` (32B) + `verifier` (32B) por cuenta. Para verificar password:

1. Leer `salt` + `verifier` de la BD para el username dado
2. Recomputar verifier con el password enviado y el salt almacenado:
   - `x = SHA1(salt || SHA1(upper(user):upper(pass)))`
   - `v' = g^x mod N`
3. Comparar `v'` con `verifier` (constant-time)

Si coincide → password correcto. Es lo que hace el authserver de WoW internamente para validar logins, replicado aquí sin involucrar al servidor de juego.

### Smart routing

`/api/auth/login` igual que `/api/auth/register`:
- Si `BRIDGE_URL` set → usa el bridge (Vercel-friendly)
- Si no → MySQL directo (local dev)

### Bridge actualizado

Nuevo endpoint en `server/bridge/src/index.mjs`:
- `POST /accounts/verify`: recibe `{username, password}`, computa verifier, compara, devuelve `{ok, accountId}` o `{ok:false, error}` (401)

### Nav

`Login` añadido a `utilityLinks` del header. Reemplaza `Radio` (que era placeholder) por simplicidad.

### Sin sesiones todavía

El endpoint solo dice "credenciales correctas" pero NO crea sesión. Es la base para añadir cookies/JWT después cuando haya features con login real (donaciones, tickets, "mi perfil", etc.).

## 3. Plan cloud Oracle Free Tier

[`docs/cloud-deployment-oracle.md`](cloud-deployment-oracle.md) — guía paso a paso de 14 secciones.

### Por qué Oracle vs alternativas

| Provider | Free 24/7? | RAM gratis | OK para AzerothCore? |
|---|---|---|---|
| **Oracle Cloud Always Free** | ✅ | **24 GB** | ✅ Holgado |
| GCP e2-micro | ✅ | 1 GB | ❌ MySQL+world no caben |
| AWS t2.micro | ❌ (12 meses) | 1 GB | ❌ Idem |
| Fly.io | ✅ | 256 MB | ❌ Imposible |
| Render free | ❌ (spin down 15min) | — | ❌ Server tiene que estar siempre arriba |

Oracle es la **única** opción real para 24/7 sin coste.

### Proceso resumido (en el doc, detallado)

1. Crear cuenta Oracle (verificación con tarjeta, no cobran)
2. VM Ampere A1 ARM (4 cores, 24GB RAM, 200GB SSD)
3. Abrir puertos en Security List + iptables (3724 auth, 8085 world, 7878 SOAP)
4. Docker via `get.docker.com`
5. `git clone` el repo
6. SCP del cliente extraído (~6-8GB, una vez, 30-90min según subida)
7. `docker compose up` (las imágenes oficiales `acore/*` son multi-arch, funcionan en ARM)
8. cloudflared como systemd service permanente
9. Vercel env vars actualizadas con la nueva URL del túnel
10. realmlist apunta a la IP pública de Oracle
11. Apagar el stack local

### Costos

| Concepto | Coste |
|---|---|
| VM ARM 24/7 | **$0** |
| 10 TB de tráfico | **$0** |
| 200 GB de disco | **$0** |
| IP pública | **$0** |
| Dominio (opcional) | $10/año |

### Riesgo conocido: cuentas Oracle inactivas

Oracle a veces cancela cuentas free cuya VM no se usa "lo suficiente". Mitigación: mantener el server corriendo (el tráfico de cloudflared cuenta como uso).

### Backups automáticos

Cron job en la VM cada 3am: dump de las 3 BDs a `~/backups/`, rotación de 14 días. Documentado en el doc.

## Build verificado

```bash
# Web
✓ Compiled successfully
✓ 44 páginas (era 43 + /login)

# Launcher
✓ main + preload + renderer
✓ TypeScript sin errores
```

## Pendiente (próximas sesiones)

- Test del .exe del launcher v0.1.0 desde GitHub Releases (lo hace el usuario)
- Cookies/JWT para sesiones reales en `/login`
- Rate limiting en `/api/auth/*` (express-rate-limit o equivalente en Edge)
- Captcha en registro (hCaptcha gratis)
- Cuando Oracle Cloud esté arriba: real-world testing de latencia, packet loss, etc.

## Estado del proyecto al cierre

| Componente | Estado | Donde corre ahora |
|---|---|---|
| Web | ✅ + /login + /registrarse activos | Vercel |
| Launcher | ✅ v0.1.0 + register page | GitHub Releases |
| Server | ✅ todo operativo | PC del user (mover a Oracle pendiente) |
| Bridge | ✅ /accounts /accounts/verify /stats/online | PC del user (mover) |
| Tunnel | ✅ trycloudflare temporal | PC del user (cambiar a persistente) |

Pendiente del usuario: ejecutar la guía Oracle Cloud (~2-3h trabajo en una sesión) para liberar el PC.
