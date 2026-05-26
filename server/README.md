# Server (AzerothCore WoTLK 3.3.5a)

Stack completo de desarrollo: MySQL + auth + world + tools + base de datos web (`ebonhold_web`), todo en Docker.

## TL;DR

```powershell
cd D:\wow\server
.\start.ps1                  # arranca MySQL + auth, sin cliente WoW
.\start.ps1 -Full            # arranca todo (necesita cliente en client-data/)
.\stop.ps1                   # para todo (los datos se preservan)
.\start.ps1 -Reset           # reset completo (borra todas las BDs)
```

## Estado actual (lo que ya funciona)

| Componente | Estado | Necesita cliente WoW? |
|---|---|---|
| MySQL 8.0 con healthcheck | ✅ funciona | No |
| `acore_auth` + `acore_world` + `acore_characters` con seeds | ✅ funciona | No |
| `ebonhold_web` con 8 tablas Drizzle | ✅ funciona | No |
| Realmlist personalizado (Acherus/Wyrmrest/Crystalsong) | ✅ funciona | No |
| Authserver | ✅ funciona | No |
| **Worldserver** | ⏳ pendiente | **Sí** |

## Setup inicial

### 1. Requisitos

- Docker Desktop corriendo
- ~15 GB libres
- (Opcional para fase 2) Cliente WoW 3.3.5a build 12340 limpio

### 2. Primera vez (sin cliente WoW)

```powershell
cd D:\wow\server
.\start.ps1
```

Hace automáticamente:
1. Verifica Docker.
2. Arranca MySQL 8.0 y espera a que esté healthy.
3. Ejecuta `ac-db-import` para crear `acore_auth`, `acore_world`, `acore_characters` con sus seeds.
4. Crea la BD `ebonhold_web` y aplica el schema Drizzle (8 tablas).
5. Arranca el `authserver` (login).

Resultado: la web puede consumir `/api/realms` con datos reales y registrar cuentas en `acore_auth.account`.

### 3. Fase 2 (con cliente WoW)

```powershell
# 1) Copia tu cliente 3.3.5a limpio a server/client-data/
# 2) Extrae mapas/dbc/vmaps/mmaps (1ª vez, 15-40 min):
docker compose --profile tools up ac-tools

# 3) Arranca el stack completo:
.\start.ps1 -Full

# 4) Para entrar a la consola del worldserver:
docker attach azerothcore-worldserver
# Ctrl+P, Ctrl+Q para salir SIN matar el server
```

## Crear una cuenta GM (consola del worldserver, fase 2)

```
account create miusuario mipassword
account set gmlevel miusuario 3 -1
```

## Crear una cuenta vía SQL (mientras no haya worldserver)

AzerothCore usa SRP6 — necesitamos un script o el módulo `auth_register` de la web (próxima fase). Por ahora se hace desde el worldserver.

## Puertos

| Puerto | Servicio |
|---|---|
| 3306 | MySQL (127.0.0.1 solo) |
| 3724 | Authserver |
| 8085 | Worldserver (Acherus) |
| 7878 | SOAP |

## Conexión desde la web

`web/.env.local` (ya configurado):

```env
DATABASE_URL="mysql://root:azerothcore@localhost:3306/ebonhold_web"
ACORE_DATABASE_URL="mysql://root:azerothcore@localhost:3306/"
```

## Comandos útiles

```powershell
# Ver logs en vivo
docker compose logs -f ac-authserver
docker compose logs -f ac-worldserver

# Estado
docker compose ps

# Entrar a MySQL
docker exec -it azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore

# Backup
docker exec azerothcore-mysql mysqldump -h 127.0.0.1 -uroot -pazerothcore `
  --databases acore_auth acore_characters ebonhold_web `
  --single-transaction > backup.sql

# Ver tamaños de BD
docker exec azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore -e `
  "SELECT table_schema, ROUND(SUM(data_length+index_length)/1024/1024,1) AS MB
   FROM information_schema.tables GROUP BY table_schema;"
```

## Notas

- **MySQL 8.0, no 8.4**: 8.4 eliminó el flag `default-authentication-plugin=mysql_native_password` que AzerothCore necesita.
- **Imagen db-import**: `acore/ac-wotlk-db-import:14.0.0-dev` pesa ~3.5 GB la primera vez (incluye los SQL de `acore_world` completos).
- **Volumen MySQL**: `server_ac-db-data` — sobrevive a `docker compose down`. Solo `.\start.ps1 -Reset` lo borra.
- **Realmlist personalizado**: ya está poblado con Acherus (PvE), Wyrmrest (PvP), Crystalsong (RP) apuntando a 127.0.0.1.

## Troubleshooting

| Error | Solución |
|---|---|
| `unknown variable 'default-authentication-plugin'` | Estás usando MySQL 8.4. Cambia a `mysql:8.0` en docker-compose.yml |
| `Can't connect to local MySQL through socket` | Usa `-h 127.0.0.1` en mysql client (fuerza TCP en vez de socket) |
| Healthcheck unhealthy pero el contenedor sigue arrancando | Espera 30-60s más; primer init crea las tablas del sistema |
| db-import falla con "access denied" | El root password no coincide. Verifica `MYSQL_ROOT_PASSWORD` en docker-compose.yml |
| Worldserver no arranca con "data files not found" | Falta extraer los mapas. Corre `docker compose --profile tools up ac-tools` |
