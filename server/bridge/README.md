# Ebonhold Bridge

Mini HTTP API local que expone read-queries de la BD del juego + creación de cuentas. Diseñado para que Cloudflare Tunnel lo publique a internet y Vercel lo consuma desde la web pública.

## Por qué existe

Vercel (serverless) no puede mantener una conexión TCP persistente a una BD MySQL local detrás de NAT. Soluciones:

- ❌ Abrir el puerto 3306 al exterior → inseguro
- ❌ Cloudflare Tunnel TCP → Vercel no puede dialear de vuelta
- ✅ **Bridge HTTP + Cloudflare Tunnel HTTP** → trabaja sobre HTTPS estándar

El bridge sólo expone los queries que la web necesita (no MySQL crudo), con autenticación por header.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Ping (sin auth) |
| GET | `/stats/online` | Jugadores online (total + por facción) |
| GET | `/accounts/exists/:username` | ¿Existe ese usuario? |
| POST | `/accounts` | Crear cuenta (con SRP6) |

Body de `POST /accounts`:

```json
{
  "username": "miusuario",
  "password": "mipassword",
  "email": "opcional@email.com"
}
```

## Autenticación

Todos los endpoints (excepto `/health`) requieren el header:

```
X-Bridge-Key: <BRIDGE_KEY>
```

`BRIDGE_KEY` es un secreto compartido entre el bridge y Vercel. Generar uno fuerte:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `BRIDGE_PORT` | `4000` | Puerto HTTP |
| `BRIDGE_KEY` | (requerida) | Secreto para auth |
| `ACORE_DATABASE_URL` | `mysql://root:azerothcore@ac-database:3306/` | Conexión MySQL |

## Arranque local

Con Docker (lo gestiona `docker-compose`):

```powershell
cd D:\wow\server
docker compose up -d ac-bridge
curl http://localhost:4000/health
```

Sin Docker (dev rápido):

```powershell
cd D:\wow\server\bridge
$env:BRIDGE_KEY = "test-key"
npm install
npm run dev
```

## Stack

- **Hono** (HTTP framework ligero, ~7KB)
- **@hono/node-server** (adapter Node.js)
- **mysql2** (pool con keep-alive)
- **node:crypto** (SRP6 inline, sin deps externas)

## Verificación manual

```bash
KEY="tu-bridge-key"
curl http://localhost:4000/health
curl -H "X-Bridge-Key: $KEY" http://localhost:4000/stats/online
curl -H "X-Bridge-Key: $KEY" http://localhost:4000/accounts/exists/GM
curl -X POST -H "X-Bridge-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"username":"nuevo","password":"123456"}' \
  http://localhost:4000/accounts
```

## Cómo exponerlo a Vercel

Ver [`docs/cloudflare-tunnel.md`](../../docs/cloudflare-tunnel.md) — guía paso a paso de Cloudflare Tunnel.
