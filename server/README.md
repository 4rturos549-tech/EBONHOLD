# Server (AzerothCore 3.3.5a)

Stack de desarrollo local con Docker. Imagenes oficiales de AzerothCore.

## Requisitos

- Docker Desktop corriendo
- Un cliente **World of Warcraft 3.3.5a (build 12340) limpio** (carpeta `WoW/` completa)
- ~15 GB de disco libre

## Pasos

### 1. Coloca el cliente

Copia tu carpeta del cliente WoW 3.3.5a en `server/client-data/` de forma que dentro veas `Data/`, `Wow.exe`, etc.

```
server/client-data/
  Data/
  Wow.exe
  realmlist.wtf
  ...
```

> El cliente NO se sube a git (esta ignorado).

### 2. Extrae mapas/dbc/vmaps/mmaps

Solo la primera vez (tarda 15-40 min segun CPU):

```powershell
cd D:\wow\server
docker compose --profile tools up ac-tools
```

Cuando termine, en `server/client-data/` apareceran las carpetas `dbc/`, `maps/`, `vmaps/`, `mmaps/`.

### 3. Arranca la base de datos e importa el esquema

```powershell
docker compose up -d ac-database
docker compose run --rm ac-db-import
```

Esto crea las 3 BDs: `acore_auth`, `acore_world`, `acore_characters` y carga los esquemas + datos base.

### 4. Arranca auth + world

```powershell
docker compose up -d ac-authserver ac-worldserver
docker compose logs -f ac-worldserver
```

Espera a ver `World initialized`.

### 5. Crea una cuenta GM

```powershell
docker attach azerothcore-worldserver
# Dentro de la consola del worldserver:
account create miusuario mipassword
account set gmlevel miusuario 3 -1
# Ctrl+P, Ctrl+Q para salir SIN matar el server.
```

### 6. Conecta el cliente

Edita `client-data/Data/esES/realmlist.wtf` (o `enUS`):

```
set realmlist 127.0.0.1
```

Lanza `Wow.exe`, login con la cuenta creada.

## Puertos

| Puerto | Servicio        |
|--------|-----------------|
| 3724   | Authserver      |
| 8085   | Worldserver     |
| 7878   | SOAP (opcional) |
| 3306   | MySQL (solo localhost) |

## Comandos utiles

```powershell
# Parar todo
docker compose down

# Parar y borrar BD (reset total)
docker compose down -v

# Ver logs
docker compose logs -f ac-worldserver

# Backup de BD
docker exec azerothcore-mysql mysqldump -uroot -pazerothcore --all-databases > backup.sql
```

## Notas

- Las contrasenas estan en plano para desarrollo local. Para produccion: cambiar `MYSQL_ROOT_PASSWORD` y NO exponer el puerto 3306.
- Modulos custom: se montaran en `server/modules/` (proxima fase).
- Para compilar desde fuente en vez de imagenes pre-construidas, ver `docs/build-from-source.md` (pendiente).
