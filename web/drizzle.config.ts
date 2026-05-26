import type { Config } from "drizzle-kit";

/**
 * Configuracion de Drizzle Kit (migraciones, introspeccion).
 *
 * Comandos utiles:
 *   npx drizzle-kit generate    # genera SQL desde el schema
 *   npx drizzle-kit migrate     # aplica migraciones pendientes
 *   npx drizzle-kit studio      # GUI web para explorar la BD
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "mysql://root:azerothcore@localhost:3306/ebonhold_web",
  },
  verbose: true,
  strict: true,
} satisfies Config;
