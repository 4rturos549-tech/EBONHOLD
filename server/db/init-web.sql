-- =========================================================
-- Ebonhold - Inicializacion de la BD web
-- =========================================================
-- Ejecutar UNA VEZ en la instancia MySQL del server.
-- Crea la BD `ebonhold_web` vacia.
-- Las tablas las creara Drizzle Kit:
--   cd web && npx drizzle-kit generate && npx drizzle-kit migrate
-- =========================================================

CREATE DATABASE IF NOT EXISTS `ebonhold_web`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Usuario dedicado para la web (mas seguro que usar root).
-- Cambia 'CAMBIAME_PASSWORD' por una contrasena fuerte.
CREATE USER IF NOT EXISTS 'ebonhold_web'@'%'
  IDENTIFIED BY 'CAMBIAME_PASSWORD';

-- Permisos: la web manda en su propia BD,
-- y solo puede LEER de las BDs del server (para realm status, login)
-- + INSERT en acore_auth.account (para registrar cuentas nuevas).
GRANT ALL PRIVILEGES ON `ebonhold_web`.* TO 'ebonhold_web'@'%';
GRANT SELECT ON `acore_characters`.* TO 'ebonhold_web'@'%';
GRANT SELECT, INSERT ON `acore_auth`.`account` TO 'ebonhold_web'@'%';
GRANT SELECT ON `acore_auth`.`realmlist` TO 'ebonhold_web'@'%';

FLUSH PRIVILEGES;
