# 2026-05-25 · Inicio del proyecto

## Objetivo

Arrancar el proyecto desde cero con una estructura clara para tres entregables: **web pública**, **launcher de escritorio** y **servidor de juego** con contenido custom.

## Decisiones tomadas

### Core del servidor: AzerothCore (no TrinityCore ni CMaNGOS)

Tras comparar las tres opciones principales para 3.3.5a:

- **AzerothCore**: arquitectura modular (añadir/quitar features sin tocar el core), base de datos de mundo muy completa, comunidad activa, Docker oficial.
- **TrinityCore**: más grande y multi-expansión, pero más rígido para personalizar.
- **CMaNGOS**: más "blizzlike" puro, pero menos extensible.

**Elegido: AzerothCore** por su modularidad y facilidad de despliegue con Docker.

### Estructura de monorepo único

Todo el proyecto vive en un solo repo Git en `d:\wow`:

```
wow/
├── web/              Next.js (despliegue Vercel)
├── launcher/         Electron/Tauri (despliegue GitHub Releases)
├── server/           AzerothCore + módulos + docker-compose
├── client-patches/   MPQs, DBCs, modelos custom
├── desarrollo/       Bitácora (esta carpeta)
└── docs/             Documentación técnica
```

Ventajas: un solo `git push`, dependencias compartidas, changelog centralizado.

### Hosting planeado

| Componente | Hosting | Coste |
|---|---|---|
| Web | Vercel | Gratis |
| Launcher (binarios) | GitHub Releases | Gratis |
| Cliente WoW (archivos grandes) | Cloudflare R2 | Gratis hasta 10 GB |
| Server (auth+world+MySQL) | Oracle Cloud Free Tier o VPS Hetzner | Gratis o ~4€/mes |
| BD de la web | Neon (Postgres) o Supabase | Gratis |

## Lo que se hizo

1. Creadas carpetas `web/`, `launcher/`, `server/`, `client-patches/`, `desarrollo/`, `docs/`.
2. Escrito `README.md` raíz con visión global.
3. Escrito `.gitignore` raíz cubriendo:
   - Artefactos Node (`node_modules/`, `.next/`, etc.)
   - Variables de entorno (`.env*`)
   - Datos pesados del servidor y del cliente (mapas, DBC, MPQ, BD)
   - Builds del launcher
4. Preparado `server/docker-compose.yml` con la stack completa de AzerothCore:
   - MySQL 8.4 con healthcheck.
   - Servicio `ac-db-import` que crea las 3 BDs (`acore_auth`, `acore_world`, `acore_characters`).
   - Servicio `ac-tools` (bajo profile `tools`) para extraer mapas/dbc/vmaps/mmaps del cliente.
   - `ac-authserver` (puerto 3724) y `ac-worldserver` (puerto 8085).
   - SOAP expuesto en 7878 para futura integración con la web.
5. Escrito `server/README.md` con flujo paso a paso de primera instalación.

## Bloqueos / pendientes

- **Docker Desktop no estaba corriendo** durante el setup → se deja todo preparado y se arranca cuando el usuario lo abra.
- **Cliente WoW 3.3.5a no incluido** (no se distribuye) → el usuario debe conseguirlo y colocarlo en `server/client-data/`.
- Compilación desde fuente vs imágenes pre-construidas → de momento usamos imágenes oficiales `:14.0.0-dev` por rapidez; documentaremos build-from-source más adelante en `docs/build-from-source.md`.

## Próximos pasos

- Construir la landing de la web (siguiente entrada).
- Cuando Docker esté disponible: arrancar el stack y crear cuenta GM de prueba.
