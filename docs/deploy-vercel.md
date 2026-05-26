# Despliegue en Vercel

Esta guía te lleva paso a paso desde "tengo el código en local" hasta "ebonhold.tudominio.com está online".

## Prerrequisitos

- Cuenta de **GitHub** (gratis).
- Cuenta de **Vercel** (gratis, conectada a tu GitHub).
- El repo de Ebonhold subido a GitHub (público o privado).

## 1. Subir a GitHub

Si todavía no lo has hecho:

```powershell
cd D:\wow
git add .
git commit -m "Initial release"
git branch -M main

# Crea un repo en github.com (por la web) llamado "ebonhold" sin README ni .gitignore
git remote add origin https://github.com/TU-USUARIO/ebonhold.git
git push -u origin main
```

## 2. Importar en Vercel

1. Entra a https://vercel.com/new
2. Click en **Import Git Repository** → elige tu repo `ebonhold`.
3. En **Configure Project**:
   - **Framework Preset**: Next.js (debería detectarse solo).
   - **Root Directory**: deja `./` — el `vercel.json` de la raíz ya redirige al subdirectorio `web/`.
   - **Build Command**: deja el default (lo coge del `vercel.json`).
   - **Output Directory**: deja el default.
4. **Environment Variables** (importante — clic en "Add"):

| Variable | Valor | Notas |
|---|---|---|
| `DATABASE_URL` | `mysql://user:pass@host:3306/ebonhold_web` | BD propia de la web |
| `ACORE_DATABASE_URL` | `mysql://user:pass@host:3306/` | Opcional, para realm status |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-proyecto.vercel.app` | URL pública |

> Si todavía no tienes la BD en producción, **deja las dos primeras vacías**. La web funcionará igual mostrando reinos offline y el registro deshabilitado. Las añades cuando montes el server.

5. Click en **Deploy**. Tarda ~2 minutos.

## 3. Verificar

Vercel te dará una URL del tipo `https://ebonhold-xyz.vercel.app`. Abre y comprueba:

- [ ] Carga la home con el logo.
- [ ] Los menús desplegan.
- [ ] El cambio de página no produce shift.
- [ ] El móvil muestra hamburger + drawer.

## 4. Dominio propio (opcional)

Si tienes un dominio (Namecheap, Cloudflare, etc.):

1. En Vercel: **Settings → Domains** → añade `ebonhold.tudominio.com`.
2. Vercel te dará registros DNS (CNAME o A). Cópialos en tu proveedor.
3. Espera 5-30 min a propagación. Vercel emite SSL automático.

## 5. Auto-deploy

Una vez conectado el repo, **cada `git push` a `main` despliega automáticamente**. Los pull requests generan **preview URLs** para revisar antes de fusionar.

## Limitaciones del free tier

- **100 GB de banda/mes** (más que suficiente para empezar).
- Funciones serverless con timeout 10s (no usamos funciones long-running).
- Sin acceso TCP directo a la BD desde funciones: **necesitas que tu MySQL acepte conexiones desde IPs de Vercel** (lista pública) o uses una BD compatible con HTTP (PlanetScale, Neon).

## Si tu MySQL está detrás de NAT

Opciones:

1. **Cloudflare Tunnel** (gratis): expone tu MySQL local con un dominio HTTPS sin abrir puertos.
2. **Tailscale + Vercel** (no oficial, complicado).
3. **Mover la BD a un servicio gestionado**: PlanetScale, Aiven, AWS RDS.
4. **Levantar un VPS** (Hetzner ~4€/mes) con MySQL público + firewall que solo permite IPs de Vercel.

Cuando lleguemos al despliegue real del server, decidiremos cuál.

## Rollback

Vercel guarda todos los deploys. Si rompes algo:

1. **Deployments** → encuentra el último que funcionaba.
2. Click en `...` → **Promote to Production**.

Reversión instantánea.

## Troubleshooting

| Error | Solución |
|---|---|
| `Module not found` en build | Verifica que `vercel.json` está en la raíz del repo. |
| `DATABASE_URL is not defined` | Añade la env var en Settings → Environment Variables y redeploy. |
| 500 en `/desarrollo/changelog` | El script `sync-content` falla. Verifica que `/desarrollo` está commiteado. |
| El logo no carga | Verifica que `/web/public/logo.svg` está en el repo. |
