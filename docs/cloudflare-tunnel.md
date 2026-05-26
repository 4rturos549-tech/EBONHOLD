# Cloudflare Tunnel: BD accesible desde Vercel

Esta guía expone el **Bridge HTTP** local a internet con HTTPS gratis y sin abrir puertos. Vercel lo usará para consultar datos reales del servidor.

## Arquitectura

```
   Vercel (https://ebonhold.vercel.app)
          │
          │  HTTPS + X-Bridge-Key
          ▼
   ebonhold-bridge.tudominio.com
          │
          │  Cloudflare Tunnel (TLS, sin abrir puertos)
          ▼
   tu PC: cloudflared
          │
          ▼
   ebonhold-bridge container :4000
          │
          ▼
   MySQL :3306 (acore_auth, acore_characters)
```

## Por qué Cloudflare Tunnel y no abrir el puerto

- ✅ Sin abrir puertos en tu router/firewall (NAT-friendly).
- ✅ HTTPS automático.
- ✅ DDoS protection de Cloudflare en frente.
- ✅ Gratis hasta tráfico modesto.
- ✅ Puedes apagarlo cuando no juegas.

## Setup paso a paso

### 1. Generar `BRIDGE_KEY` y arrancar el bridge

```powershell
cd D:\wow\server

# Generar un secreto fuerte
$key = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
$key | Out-File -Encoding ascii .env -Force
"BRIDGE_KEY=$key" | Set-Content .env

# Levantar el bridge
docker compose up -d --build ac-bridge

# Probar local
curl http://localhost:4000/health
# {"ok":true,"ts":...}
```

Guarda `$key` — lo usarás en Vercel después.

### 2. Instalar cloudflared

**Windows (recomendado, scoop o manual):**
```powershell
# Opción A: con scoop
scoop install cloudflared

# Opción B: manual desde https://github.com/cloudflare/cloudflared/releases
# Descarga cloudflared-windows-amd64.exe y ponlo en el PATH como cloudflared.exe
```

Verificar:
```powershell
cloudflared --version
```

### 3. (Opcional rápido) URL temporal `*.trycloudflare.com`

Si solo quieres probar sin crear cuenta Cloudflare ni dominio:

```powershell
cloudflared tunnel --url http://localhost:4000
```

Te dará una URL pública del tipo `https://abc-xyz-foo.trycloudflare.com`. Funciona inmediatamente, pero la URL cambia cada vez que reinicies — no sirve para producción.

### 4. (Recomendado) Túnel persistente con dominio propio

Necesitas un dominio en Cloudflare (gratis si lo migras allí, o ~10€/año si compras nuevo).

```powershell
# 1) Login (abre navegador, autoriza)
cloudflared tunnel login

# 2) Crear el túnel
cloudflared tunnel create ebonhold-bridge

# Output: te dará un ID, ejemplo:
# Tunnel credentials written to C:\Users\TU\.cloudflared\<UUID>.json

# 3) Crear DNS route (sustituye TU_DOMINIO)
cloudflared tunnel route dns ebonhold-bridge bridge.tudominio.com

# 4) Crear archivo de configuración
```

`~/.cloudflared/config.yml`:

```yaml
tunnel: ebonhold-bridge
credentials-file: C:\Users\TU\.cloudflared\<UUID>.json

ingress:
  - hostname: bridge.tudominio.com
    service: http://localhost:4000
  - service: http_status:404
```

```powershell
# 5) Arrancar el túnel
cloudflared tunnel run ebonhold-bridge

# Probar desde fuera:
curl https://bridge.tudominio.com/health
```

### 5. (Opcional) Servicio Windows para que arranque solo

```powershell
cloudflared service install
```

Ahora el túnel arranca con Windows automáticamente.

### 6. Configurar Vercel

En el dashboard de Vercel → Project → **Settings → Environment Variables**, añade:

| Variable | Valor |
|---|---|
| `BRIDGE_URL` | `https://bridge.tudominio.com` (o tu URL `trycloudflare.com`) |
| `BRIDGE_KEY` | El mismo secreto que pusiste en `server/.env` |

Marca las 3 environments: Production, Preview, Development.

**Redeploy** el proyecto (Deployments → ⋯ → Redeploy).

### 7. Verificar

Abre https://ebonhold.vercel.app/api/realms — antes devolvía todos los reinos offline. Ahora, si tienes jugadores conectados al worldserver local, deberías ver `players: X` y `status: "online"`.

Prueba también `/registrarse` en la web — el formulario debería crear cuentas reales en tu BD local vía el túnel.

## Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| 401 Unauthorized | BRIDGE_KEY no coincide | Verifica que el mismo valor está en `server/.env` y en Vercel env vars |
| 502 Bad Gateway | cloudflared no corre o bridge caído | `cloudflared tunnel run ebonhold-bridge` + `docker compose ps` |
| Connection refused | Bridge no escucha | `docker logs ebonhold-bridge` para ver errores |
| Vercel sigue mostrando offline | Cache | Redeploy o espera 30s (cache CDN de `/api/realms`) |
| `trycloudflare.com` URL cambia | Es la naturaleza del túnel temporal | Usa el túnel persistente con dominio (paso 4) |

## Costos

- **Cloudflare Tunnel**: gratis para uso personal/comunitario.
- **Dominio**: ~10€/año (Cloudflare Registrar o Namecheap). No necesario si usas `trycloudflare.com`.
- **Tráfico**: gratis hasta cantidades masivas. Ebonhold consume <1 MB/día probablemente.

## Apagar todo (privacidad)

Si quieres que el bridge solo esté disponible cuando tú quieras:

```powershell
# Para el túnel
Get-Process cloudflared | Stop-Process
# o si lo instalaste como servicio:
Stop-Service cloudflared

# Para el bridge
docker compose stop ac-bridge
```

Vercel volverá a mostrar reinos offline (graceful fallback).
