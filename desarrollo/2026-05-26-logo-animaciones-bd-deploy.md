# 2026-05-26 · Logo SVG + animaciones + base de datos + deploy a Vercel

## Objetivo

Cuatro bloques en una sesión:
1. **Logo SVG propio** para reemplazar el texto EBONHOLD plano.
2. **Animaciones y microinteracciones** para que la web se sienta viva.
3. **Base de datos** completa (Drizzle ORM + MySQL) lista para producción.
4. **Despliegue a Vercel** documentado paso a paso.

## 1. Logo

### Diseño

Diamante en tres capas:
- **Anillo exterior** con gradiente cyan (de `#a8ddf5` a `#3a7fa5`).
- **Diamante interior** obsidiana sólido con borde frost.
- **Cristal vertical central** estilo Frostmourne (gradiente cyan claro).
- **Cuatro puntas brillantes** en las esquinas cardinales.
- **Línea de brillo central** vertical blanca al 60% opacidad.

### Archivos

- [`web/public/logo.svg`](../web/public/logo.svg) — para `<img>` o backgrounds.
- [`web/public/favicon.svg`](../web/public/favicon.svg) — versión simplificada con fondo redondeado (32x32).
- [`web/src/components/ui/logo.tsx`](../web/src/components/ui/logo.tsx) — componente React (SVG inline, parametrizable: `size`, `withGlow`).

### Integración

- **Header desktop y móvil**: logo + wordmark con `group-hover:scale-110 group-hover:rotate-[8deg]` y animación `logo-float` (sube y baja 2px con glow pulsante cada 4s).
- **Favicon** registrado en `metadata.icons` del root layout.
- **Open Graph** configurado para previews en redes sociales.

## 2. Animaciones y microinteracciones

### Keyframes añadidos a `globals.css`

| Animación | Uso |
|---|---|
| `fade-in-up` | Entrada de paneles/cards al cargar (12px de translateY) |
| `fade-in` | Entrada simple para elementos sutiles |
| `logo-float` | Pulsación + flotación del logo del header |
| `shimmer` | Skeleton loaders (preparado para futuro) |
| `pulse-soft` | Indicadores genéricos |
| `status-pulse` | Anillo expansivo verde para reinos online |

### Clases utilitarias

- `.animate-fade-in-up` — aplica el fade-in con translación.
- `.stagger-1` a `.stagger-6` — delays incrementales (50ms / step) para entradas escalonadas.
- `.lift-on-hover` — eleva 2px con curva spring (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- `.link-underline` — underline animado desde la izquierda en hover.
- `.shimmer-bg` — fondo animado tipo skeleton.

### Aplicación

- **Home**: banner Carta Abierta con `lift-on-hover`, hero con `stagger-1`, sidebar con `stagger-2`, noticias con stagger 3-5.
- **Página de clases**: cada card con delay incremental basado en su índice (animationDelay inline).
- **Realm status**: el dot verde de reinos online pulsa con anillo expansivo (`status-pulse`).
- **PageHeader**: fade-in-up al cargar cualquier página interna.
- **Logo**: float + glow pulsante constantes + scale/rotate al hover.

### Accesibilidad

`@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones y transiciones para usuarios sensibles al movimiento.

## 3. Base de datos

### Decisión arquitectónica

**Una instancia MySQL, cuatro bases de datos lógicas**:

| BD | Propietario | Para qué |
|---|---|---|
| `acore_auth` | AzerothCore (obligatoria) | Cuentas, realms, bans |
| `acore_world` | AzerothCore (obligatoria) | NPCs, quests, items |
| `acore_characters` | AzerothCore (obligatoria) | Personajes, inventarios, AH |
| `ebonhold_web` | Web | Noticias, foro, sesiones, donaciones, tickets |

> El core de AzerothCore exige las 3 primeras separadas (no es opcional). La 4ª es nuestra y mantiene la separación de concerns: actualizar AzerothCore nunca borra nuestros datos.

### Stack elegido

- **Drizzle ORM** (TypeScript-first, sin código generado, queries type-safe, soporte MySQL excelente)
- **mysql2/promise** como driver (estable, rápido, soporta connection pooling)
- **drizzle-kit** para migraciones y studio (GUI)

### Schema (`web/src/lib/db/schema.ts`)

Siete tablas listas para producción:

- **`news`** — sistema de noticias (slug, título, body, fecha publicación, autor)
- **`sessions`** — sesiones de login web (id, accountId, expira)
- **`forum_categories`** + **`forum_threads`** + **`forum_posts`** — foro completo
- **`donations`** — registro de donaciones (Stripe/PayPal/Ko-fi)
- **`tickets`** — soporte
- **`realm_stats`** — snapshots de población por reino (alimentado por cron)

Todas con índices apropiados, foreign keys lógicas, timestamps automáticos.

### Cliente Drizzle (`web/src/lib/db/client.ts`)

- Connection pooling (5 conexiones max)
- Reutiliza pool entre hot-reloads en dev (`globalThis.__dbPool`)
- Type-safe: `db.select().from(news)` autocompleta columnas

### Bridge con AzerothCore (`web/src/lib/db/acore.ts`)

Conexión opcional read-only/limited write hacia las BDs del core. Funcionalidades:

- `fetchOnlinePlayers()` — lee `acore_characters.characters` y agrupa por facción (Alianza vs Horda).
- Preparado para escribir en `acore_auth.account` cuando se implemente registro.
- **Si `ACORE_DATABASE_URL` no está definido**, la web funciona igualmente con reinos offline y registro deshabilitado → puedes desarrollar la web sin el server arrancado.

### Inicialización (`server/db/init-web.sql`)

Crea `ebonhold_web` + usuario `ebonhold_web` con permisos mínimos:
- ALL en su propia BD
- SELECT en `acore_characters` (para estado de reinos)
- SELECT+INSERT en `acore_auth.account` (para registro)
- SELECT en `acore_auth.realmlist` (para listar reinos)

### Scripts NPM

```bash
npm run db:generate   # genera SQL desde el schema TS
npm run db:migrate    # aplica migraciones
npm run db:studio     # abre GUI en localhost:4983
npm run db:push       # sincroniza schema sin migraciones (dev)
```

### Variables de entorno

[`web/.env.example`](../web/.env.example) documenta:
- `DATABASE_URL` — BD web (obligatoria si quieres BD funcional)
- `ACORE_DATABASE_URL` — BDs del core (opcional)
- `NEXT_PUBLIC_SITE_URL` — para SEO/sitemap

### Documentación

[`server/db/README.md`](../server/db/README.md) con diagrama ASCII de conexiones y guía de setup completa.

## 4. Despliegue a Vercel

### Configuración

[`vercel.json`](../vercel.json) en la raíz del repo configura Vercel para encontrar Next.js dentro de `web/`:

```json
{
  "buildCommand": "cd web && npm run build",
  "devCommand": "cd web && npm run dev",
  "installCommand": "cd web && npm install",
  "outputDirectory": "web/.next",
  "framework": "nextjs"
}
```

### Guía completa

[`docs/deploy-vercel.md`](../docs/deploy-vercel.md) cubre paso a paso:

1. Subir a GitHub
2. Importar en Vercel
3. Configurar env vars (con tabla de variables)
4. Verificar despliegue
5. Conectar dominio propio
6. Auto-deploy en cada push
7. Limitaciones del free tier
8. Soluciones para conectar MySQL detrás de NAT (Cloudflare Tunnel, PlanetScale, VPS)
9. Rollback
10. Troubleshooting (tabla de errores comunes)

### Estado actual

- Build limpio: ✓ 41 páginas estáticas, 0 warnings, 0 errors.
- Las páginas funcionan sin BD (registro deshabilitado, reinos offline).
- Listo para deploy: solo falta `git push` + clicks en Vercel.

## Verificación final

```bash
npm run build
# ✓ Compiled successfully in 3.6s
# ✓ 41 páginas generadas estáticamente
# ✓ 0 warnings · 0 errors
```

## Lo que se siente diferente ahora

- **Identidad visual**: el logo SVG con cristal frost le da personalidad propia.
- **La web respira**: las páginas no "aparecen", se desvanecen suavemente.
- **Hover delicioso**: cards que se elevan, dot del realm pulsando, logo flotando.
- **Producción-ready**: el schema de BD es real, no un toy example.
- **Deploy sin fricción**: en cuanto haya un `git push`, está en internet.

## Pendientes para próximas sesiones

- Conectar `/api/realms` real (cuando el server esté arrancado).
- Implementar registro real con SRP6 hash → `acore_auth.account`.
- Forum funcional consumiendo `forum_threads` / `forum_posts`.
- Cron job que rellena `realm_stats` cada 5 minutos.
- Calculadora de talentos interactiva.
- Empezar el launcher Electron.
