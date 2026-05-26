# Base de datos

Toda la infraestructura de Ebonhold corre sobre **una sola instancia MySQL**, que aloja **4 bases de datos lógicas**:

| BD | Propietario | Contenido |
|---|---|---|
| `acore_auth` | AzerothCore (obligatoria) | Cuentas, realms, bans |
| `acore_world` | AzerothCore (obligatoria) | NPCs, quests, items, scripts |
| `acore_characters` | AzerothCore (obligatoria) | Personajes, inventarios, AH |
| `ebonhold_web` | Web | Noticias, foro, sesiones, donaciones |

> **¿Por qué 4 y no 1?** AzerothCore requiere las 3 primeras separadas — es parte de su arquitectura. La 4ª es nuestra para no contaminar las del core (así actualizar AzerothCore nunca borra nuestros datos).

## Setup

### 1. Inicializar las del server

Ya lo hace `docker compose run --rm ac-db-import` (ver [`../README.md`](../README.md)).

### 2. Inicializar la BD web

```bash
# Desde el host (mientras Docker corre)
docker exec -i azerothcore-mysql mysql -uroot -pazerothcore < init-web.sql
```

Esto crea `ebonhold_web` vacía + el usuario `ebonhold_web` con permisos justos.

### 3. Generar las tablas web (desde web/)

```bash
cd ../../web
cp .env.example .env.local
# Edita .env.local con DATABASE_URL apuntando a ebonhold_web

npx drizzle-kit generate    # genera SQL desde el schema TS
npx drizzle-kit migrate     # aplica al servidor
```

## Diagrama de conexiones

```
                  ┌───────────────────────────┐
                  │   MySQL 8 (1 instancia)   │
                  │                           │
                  │  ├─ acore_auth            │
                  │  ├─ acore_world           │
                  │  ├─ acore_characters      │
                  │  └─ ebonhold_web          │
                  └─────────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
        ┌─────▼─────┐    ┌──────▼──────┐    ┌─────▼─────┐
        │ authserver│    │ worldserver │    │   web     │
        │ :3724     │    │ :8085       │    │ Next.js   │
        └───────────┘    └─────────────┘    └───────────┘
        leen+escriben    leen+escriben       lee acore_*
        acore_auth       acore_world         escribe en su
                         acore_characters    propia BD
```

## Backups

Para hacer un dump completo del estado:

```bash
docker exec azerothcore-mysql mysqldump \
  -uroot -pazerothcore \
  --databases acore_auth acore_characters ebonhold_web \
  --single-transaction \
  > backup-$(date +%Y%m%d).sql
```

`acore_world` no se respalda normalmente — se regenera desde los sql del repo.
