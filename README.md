# Proyecto Servidor WoW WoTLK 3.3.5a

Servidor privado de World of Warcraft: Wrath of the Lich King (3.3.5a) basado en **AzerothCore**, con web pública, launcher propio y contenido custom.

## Estructura del monorepo

```
wow/
├── web/              # Página web pública (Next.js → Vercel)
├── launcher/         # Launcher de escritorio (Electron/Tauri → GitHub Releases)
├── server/           # AzerothCore + módulos + docker-compose
├── client-patches/   # MPQs, DBCs, modelos custom para el cliente
├── desarrollo/       # Bitácora / changelog de desarrollo (alimenta la web)
└── docs/             # Documentación técnica
```

## Estado actual

Ver [desarrollo/CHANGELOG.md](desarrollo/CHANGELOG.md) para la bitácora completa.

## Stack

- **Core del servidor**: [AzerothCore](https://www.azerothcore.org/) (WotLK 3.3.5a)
- **Web**: Next.js 15 + TypeScript + TailwindCSS (Vercel)
- **Launcher**: Electron + electron-updater (GitHub Releases)
- **Base de datos**: MySQL 8 (server) + Postgres/Neon (web)
- **CI/CD**: GitHub Actions

## Cómo arrancar el servidor en local

Ver [server/README.md](server/README.md).
