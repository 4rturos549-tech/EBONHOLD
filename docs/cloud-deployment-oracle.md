# Despliegue 24/7 gratis en Oracle Cloud Free Tier

Esta guía te lleva desde "todo corre en mi PC" hasta "puedo apagar mi PC y Ebonhold sigue online 24/7, gratis".

## Por qué Oracle Cloud

Oracle ofrece un **"Always Free Tier"** que es objetivamente la mejor opción gratis del mercado para hospedar AzerothCore:

| Recurso | Cantidad gratuita | Resto del mercado gratis |
|---|---|---|
| **CPU** | 4 cores ARM Ampere A1 | AWS/GCP: 1 vCPU mínimo |
| **RAM** | 24 GB | AWS/GCP: 1 GB mínimo |
| **Almacenamiento** | 200 GB de bloque | AWS/GCP: 5-30 GB |
| **Red** | 10 TB salida/mes | Suficiente |
| **Duración** | Forever Free | AWS: 12 meses, GCP: variado |
| **IP pública** | Sí, gratis | Sí pero limitada |

Es lo que se usa para hospedar pequeños servers privados de WoW sin pagar. La pega: necesitas verificar con tarjeta (no la cobran).

## Resumen del proceso

1. Crear cuenta Oracle Cloud
2. Provisionar VM ARM (4 cores, 24GB)
3. Abrir puertos del firewall (3724 auth, 8085 world)
4. Instalar Docker
5. Clonar este repo en la VM
6. Subir tu cliente WoW extraído (los maps/vmaps/mmaps/dbc)
7. `start.ps1 -Full` equivalente en Linux
8. cloudflared persistente
9. Actualizar Vercel env vars con la nueva URL del túnel
10. Cambiar tu `realmlist.wtf` para que apunte a la IP/dominio público

Tiempo total: **2-3 horas** (incluyendo la subida del cliente).

---

## 1. Cuenta Oracle Cloud

1. Ve a https://www.oracle.com/cloud/free/
2. Click **Start for free**
3. Rellena el form. **Importante**:
   - Usa un email **real** (lo verifican)
   - **Home Region**: elige la más cercana a tus jugadores (`Brazil East (São Paulo)`, `Spain Central (Madrid)`, `Mexico Central (Querétaro)` si está disponible)
   - Tarjeta de crédito requerida para verificación (no la cobran sin permiso explícito)

Espera 5-10 min a que active la cuenta.

## 2. Provisionar la VM ARM

1. Login en https://cloud.oracle.com
2. Menú ☰ → **Compute** → **Instances**
3. **Create instance**
4. **Configuración**:
   - **Name**: `ebonhold-server`
   - **Image**: Ubuntu 22.04 (Canonical Ubuntu) Aarch64 — ARM
   - **Shape**: click "Change shape" → **Ampere** → **VM.Standard.A1.Flex**
     - **OCPUs**: `4`
     - **Memory**: `24 GB`
   - **Networking**:
     - "Public IPv4 address" → **Assign a public IPv4 address**
   - **SSH keys**:
     - "Generate a key pair" → **Download both** (private + public). Guarda el `.key` privado en un lugar seguro — sin él no entras.
   - **Boot volume**: 200 GB (máximo gratis)
5. **Create**

Espera 30 segundos. Cuando esté "Running", anota la **Public IP address** (la verás arriba). Algo como `132.226.X.Y`.

## 3. Abrir puertos en el firewall de Oracle

Oracle tiene **dos niveles** de firewall: la VCN (cloud) y el OS (Ubuntu). Hay que abrir ambos.

### 3a. VCN (Oracle Cloud)

1. En la página de la instancia, click el link de la VNIC (sección "Primary VNIC information") → click el link del "Subnet"
2. Click el link del "Default Security List"
3. **Add Ingress Rules** (botón azul). Añade estas reglas (una por una):

   | Source CIDR | Protocol | Port Range | Description |
   |---|---|---|---|
   | `0.0.0.0/0` | TCP | `3724` | Authserver |
   | `0.0.0.0/0` | TCP | `8085` | Worldserver |
   | `0.0.0.0/0` | TCP | `7878` | SOAP (opcional) |

   > NO abras 3306 (MySQL) ni 4000 (bridge). MySQL queda solo interno, el bridge va por cloudflared.

### 3b. Ubuntu firewall

Lo configuramos en el siguiente paso desde SSH.

## 4. Conectar por SSH

En tu PC:

```powershell
# Usa la key .key que descargaste
ssh -i C:\ruta\a\tu\ssh-key-XXXX.key ubuntu@132.226.X.Y
```

> En Windows, si te quejas de permisos del .key, ejecuta:
> ```powershell
> icacls C:\ruta\a\tu\ssh-key-XXXX.key /inheritance:r
> icacls C:\ruta\a\tu\ssh-key-XXXX.key /grant:r "$($env:USERNAME):(R)"
> ```

Una vez dentro:

```bash
# Abrir puertos en el firewall del OS
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3724 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8085 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 7878 -j ACCEPT
sudo netfilter-persistent save
```

## 5. Instalar Docker

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Cierra y vuelve a entrar por SSH para que tome el grupo
exit
```

Reentra con SSH y verifica:
```bash
docker run hello-world
```

## 6. Clonar el repo

```bash
sudo apt install -y git
git clone https://github.com/4rturos549-tech/EBONHOLD.git ~/ebonhold
cd ~/ebonhold/server
```

## 7. Subir el cliente WoW extraído

**Esto es lo único pesado**. La extracción ya la hiciste en local. Solo necesitas subir las carpetas resultantes (~6-8 GB):

- `client-data/dbc/`
- `client-data/maps/`
- `client-data/vmaps/`
- `client-data/mmaps/`
- `client-data/Cameras/`
- `client-data/mmaps-config.yaml`

> No subas los archivos `.MPQ` (~5 GB) ni `Data/`, ni `Wow.exe`. Esos son del cliente, el server no los necesita.

Desde tu PC Windows:

```powershell
# Comprime las carpetas necesarias (un solo .tar.gz, súbelo y descomprime)
cd D:\wow\server\client-data
tar -czf C:\Users\TU\Desktop\client-extracted.tar.gz `
  dbc maps vmaps mmaps Cameras mmaps-config.yaml

# Sube por SCP (puede tardar 30-90 min según tu subida)
scp -i C:\ruta\ssh-key.key C:\Users\TU\Desktop\client-extracted.tar.gz ubuntu@132.226.X.Y:/tmp/
```

En la VM, descomprime:

```bash
mkdir -p ~/ebonhold/server/client-data
cd ~/ebonhold/server/client-data
tar -xzf /tmp/client-extracted.tar.gz
rm /tmp/client-extracted.tar.gz
ls
# debería listar: dbc, maps, vmaps, mmaps, Cameras, mmaps-config.yaml
```

## 8. ¿AzerothCore tiene imágenes ARM?

**Sí**. Las imágenes `acore/ac-wotlk-*:14.0.0-dev` son multi-arch (amd64 + arm64). Docker auto-detecta tu arquitectura y baja la correcta.

> Si por alguna razón la imagen no funciona en ARM, hay imágenes alternativas en `acore/ac-wotlk-*:master` o construir desde fuente (`docker compose -f docker-compose-with-build.yml build`).

## 9. Arrancar el stack en la VM

```bash
cd ~/ebonhold/server

# Generar BRIDGE_KEY
KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null \
   || openssl rand -hex 32)
echo "BRIDGE_KEY=$KEY" > .env
echo "Tu BRIDGE_KEY (cópialo, lo necesitas en Vercel):"
echo "$KEY"

# Arrancar MySQL primero
docker compose up -d ac-database

# Espera 30s a que esté healthy
sleep 30 && docker compose ps

# Importar BDs del core (5-10 min la primera vez en ARM)
docker compose run --rm ac-db-import

# Inicializar BD web
docker exec -i azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore < db/init-web.sql

# Migrar tablas web (necesitamos node)
sudo apt install -y nodejs npm
cd ../web && npm install && npx drizzle-kit push --force
cd ../server

# Arrancar todo
docker compose up -d ac-bridge ac-authserver ac-worldserver

# Verificar
docker compose ps
docker logs azerothcore-worldserver | tail -20
```

Espera a ver `WORLD: World Initialized` en el log del worldserver.

## 10. Crear cuenta GM en la VM

```bash
cd ~/ebonhold/web
node scripts/create-account.mjs gm 12345 3
node scripts/create-account.mjs test test 0
```

## 11. Actualizar realmlist a la IP pública

```bash
docker exec azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore acore_auth -e "
UPDATE realmlist SET address = '132.226.X.Y' WHERE id = 1;
SELECT id, name, address, port FROM realmlist;
"
```

Sustituye `132.226.X.Y` por tu IP pública. **Importante**: el cliente WoW recibirá esta IP cuando se conecte → debe ser reachable.

## 12. cloudflared persistente como servicio

```bash
# Instalar
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb

# Login (te dará una URL para autorizar en navegador)
cloudflared tunnel login

# Crear túnel
cloudflared tunnel create ebonhold-bridge

# Configurar
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: ebonhold-bridge
credentials-file: /home/ubuntu/.cloudflared/<UUID>.json

ingress:
  - hostname: bridge.tudominio.com
    service: http://localhost:4000
  - service: http_status:404
EOF

# Edita <UUID> por el UUID real del túnel:
ls ~/.cloudflared/
# (verás el .json con el UUID, ponlo en config.yml)

# DNS
cloudflared tunnel route dns ebonhold-bridge bridge.tudominio.com

# Instalar como servicio (arranca con el OS)
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

> ¿No tienes dominio en Cloudflare? Comprá uno (~$10/año en Cloudflare Registrar — sin renovación gratis) o usa el túnel rápido con URL `*.trycloudflare.com` ejecutando `cloudflared tunnel --url http://localhost:4000` (la URL cambia si lo paras).

## 13. Apuntar Vercel a la nueva URL

En Vercel → Settings → Environment Variables, actualiza:

| Variable | Nuevo valor |
|---|---|
| `BRIDGE_URL` | `https://bridge.tudominio.com` |
| `BRIDGE_KEY` | El `$KEY` que generaste en la VM |

**Redeploy** (Deployments → ⋯ → Redeploy).

## 14. Apagar el túnel y stack local

En tu PC:

```powershell
# Apaga cloudflared local (cierra la ventana de PowerShell donde corría)
# Apaga el stack local de Docker
cd D:\wow\server
docker compose down
```

Ya no necesitas el server local. Todo vive en la VM.

## 15. Conectar al server en la nube

En tu cliente WoW:

```
Data\esMX\realmlist.wtf:
set realmlist 132.226.X.Y     # tu IP pública de Oracle
```

Lanza Wow.exe → login → Acherus → ¡juega!

## Verificación final

- https://ebonhold.vercel.app/api/realms → `Acherus: online, players: N`
- https://ebonhold.vercel.app/registrarse → crea cuenta nueva, funciona
- https://ebonhold.vercel.app/login → login con cuenta existente, funciona
- Tu PC apagado y todo sigue funcionando ✓

## Backups automáticos

Crea un cronjob en la VM que respalda MySQL cada noche:

```bash
sudo crontab -e

# Añade:
0 3 * * * docker exec azerothcore-mysql mysqldump -uroot -pazerothcore --databases acore_auth acore_characters ebonhold_web --single-transaction > /home/ubuntu/backups/db-$(date +\%Y\%m\%d).sql.gz && find /home/ubuntu/backups -name "db-*.sql.gz" -mtime +14 -delete
```

```bash
mkdir -p /home/ubuntu/backups
```

Mantiene 14 días de backups.

## Monitoreo

```bash
# Logs del worldserver
docker logs -f azerothcore-worldserver

# Uso de recursos
htop
docker stats

# Verificar tunnel
sudo systemctl status cloudflared

# Reiniciar todo si algo va mal
cd ~/ebonhold/server
docker compose restart
```

## Costos esperados

| Mes | Costo |
|---|---|
| 1 | $0 |
| 2 | $0 |
| ... | $0 |
| Para siempre | $0 |

**Único costo opcional**: el dominio (~$10/año si quieres `tudominio.com` propio en vez de `*.trycloudflare.com`).

## Si Oracle cierra tu cuenta

Algunas cuentas free se cancelan automáticamente si la VM lleva semanas inactiva. Mitigación:
- Mantén la VM corriendo (el server queda activo solo)
- Cada cierto tiempo entra por SSH manualmente
- O usa un script keep-alive: `crontab` que escribe un timestamp diario en un log

## Troubleshooting

| Síntoma | Causa | Fix |
|---|---|---|
| `Connection refused` al conectar el cliente | Puertos VCN no abiertos | Revisa Security List en Oracle Cloud → ingress rules |
| `Connection refused` con todo abierto | iptables del OS | `sudo iptables -L` y reglas paso 4 |
| Worldserver no arranca, "no data files" | Faltaron carpetas al subir | Verifica que `dbc/`, `maps/`, `vmaps/`, `mmaps/` están en `client-data/` |
| Bridge 502 | cloudflared no corre | `sudo systemctl restart cloudflared` |
| Vercel sigue mostrando offline | Cache CDN o env vars sin propagar | Redeploy con cache desactivado |
| Imagen Docker no se baja en ARM | Tag específico de arch | Prueba `:master` en vez de `:14.0.0-dev` en docker-compose.yml |

## Resumen visual final

```
                      [Tu PC apagado]
                              ✗

[Jugadores en Internet]
       │
       │  Connect 132.226.X.Y:3724/8085
       ▼
┌──────────────────────────────────────────────┐
│  Oracle Cloud VM (Free Tier, ARM)            │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Docker stack                          │  │
│  │  azerothcore-mysql                    │  │
│  │  azerothcore-authserver :3724 PÚBLICO │  │
│  │  azerothcore-worldserver :8085 PÚB.   │  │
│  │  ebonhold-bridge :4000 (interno)      │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  cloudflared (systemd service)               │
│  └─ bridge.tudominio.com → :4000             │
└──────────────────────────────────────────────┘
              │ HTTPS
              ▼
       Cloudflare Edge
              │
              ▼
       Vercel (ebonhold.vercel.app)
       └─ /api/* lee desde bridge.tudominio.com
```

Servidor 24/7. Sin tu PC. Sin coste fijo.
