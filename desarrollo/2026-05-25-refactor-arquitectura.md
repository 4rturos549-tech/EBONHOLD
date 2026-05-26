# 2026-05-25 · Refactor a arquitectura limpia + páginas internas + marca "Masamune"

## Objetivo

Pasar de un prototipo plano a una **arquitectura limpia, escalable y profesional**, crear todas las páginas faltantes de la navegación, y dar al servidor un nombre con identidad.

## Decisiones

### Nombre del servidor: **MASAMUNE**

- Tagline: *"El Filo Eterno de Azeroth"*
- Origen: `Masamuness` (apodo del fundador Carlos) → Masamune (正宗), legendario forjador japonés de katanas.
- Encaja con la mitología WoW de espadas legendarias (Frostmourne, Ashbringer, Quel'Delar, Shalamayne).
- Corto, memorable, único en el ecosistema de servers privados hispanos.
- **Reinos** nombrados como espadas legendarias:
  - **Frostmourne** (PvE)
  - **Ashbringer** (PvP)
  - **Quel'Delar** (RP)

> Toda la marca vive en [`src/config/brand.ts`](../web/src/config/brand.ts). Cambiarla ahí propaga a todo el sitio (header, footer, metadatos, etc).

### Arquitectura (capas separadas)

```
web/src/
├── app/                        Solo rutas y páginas (App Router)
│   ├── caracteristicas/        9 sub-rutas
│   ├── clases/                 índice + [slug] dinámico + calculadora
│   ├── desarrollo/             changelog (real), roadmap, patches, bugs, base-de-datos
│   ├── comunidad/              foro, hermandades
│   ├── medios/                 arte, trailers, logos
│   ├── carta-abierta/
│   ├── comenzar/
│   ├── descargar/
│   ├── donar/
│   ├── radio/
│   ├── reglas/
│   └── registrarse/
├── components/
│   ├── ui/                     Primitives sin lógica de dominio
│   │   ├── panel.tsx           Panel + PanelHeader
│   │   ├── button.tsx          Button + ButtonLink (3 variantes, 3 tamaños)
│   │   ├── divider.tsx
│   │   └── page-header.tsx     Patrón de breadcrumb + título + subtítulo
│   ├── layout/                 Cascarón del sitio
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── nav-dropdown.tsx    Único client component
│   └── features/               Componentes con lógica de dominio
│       ├── realm-status.tsx
│       ├── coming-soon.tsx
│       └── markdown.tsx        Renderer minimal de markdown (sin deps)
├── config/                     Punto único de verdad para datos estáticos
│   ├── brand.ts                Identidad, social, contacto
│   ├── nav.ts                  Estructura de menú (alimenta header + sitemap)
│   ├── realms.ts               Listado de reinos (futuro: API real)
│   └── classes.ts              Catálogo de 9 clases jugables
├── lib/                        Utilidades puras
│   ├── utils.ts                cn() para concatenar clases, formatDate
│   └── changelog.ts            Lee /content/desarrollo (server-only)
└── content/                    [generado] Devlogs sincronizados desde /desarrollo
```

### Patrones aplicados

- **Server Components por defecto**. Único client component: `nav-dropdown.tsx` (necesita useState para hover).
- **Config-driven**: nav, reinos, clases y branding viven en `config/`. Tocar un menú = editar un objeto.
- **Tipado fuerte** con tipos exportados (`Brand`, `NavItem`, `NavGroup`, `Realm`, `ClassSpec`).
- **Dynamic route con `generateStaticParams`** para las clases (`/clases/[slug]`) → 9 páginas estáticas generadas en build.
- **Path alias `@/*`** ya configurado en `tsconfig` → imports limpios.

### Changelog real (lee la carpeta `/desarrollo`)

Se añadió un sistema para que `/desarrollo/changelog` muestre **automáticamente** los devlogs de esta carpeta:

1. Script `sync-content` en `web/package.json` que copia `/desarrollo` → `/web/content/desarrollo` (cross-platform, sin dependencias, usando `fs.cpSync` de Node).
2. Hooks `predev` y `prebuild` lo ejecutan automáticamente.
3. `src/lib/changelog.ts` lee `content/desarrollo/*.md`, extrae fecha y título del slug del archivo, y los ordena.
4. `src/components/features/markdown.tsx` renderiza el markdown (sin deps externas).
5. `/web/content/` está en `.gitignore` (la fuente vive en `/desarrollo`).

> Esto significa: **cada vez que añadas un devlog en `/desarrollo/`, aparecerá en la web al hacer push**. No hay que tocar código.

## Páginas creadas (28 nuevas)

| Sección | Páginas |
|---|---|
| Características | personajes, hermandades, profesiones, zonas, mazmorras, desafíos, transporte, ui, eventos |
| Clases | índice + 9 dinámicas + calculadora |
| Desarrollo | changelog (real), roadmap, patches, bugs, base-de-datos |
| Comunidad | foro, hermandades |
| Medios | arte, tráilers, logos |
| Utilidades | carta-abierta, comenzar, descargar, donar, radio, reglas, registrarse |

Páginas con **contenido real**: reglas (6 reglas), roadmap (5 fases), donar, comenzar (4 pasos), registrarse (form deshabilitado hasta tener BD), descargar, carta-abierta, clases (todas con datos reales).

Páginas con **placeholder ComingSoon**: el resto. Cuando alguien las llene, basta editar la página (no hay que tocar layout ni rutas).

## Verificación

```bash
npm run build
# ✓ Compiled successfully in 4.4s
# ✓ 41 páginas generadas estáticamente
# ✓ 0 warnings, 0 errors
```

## Cómo extender de aquí en adelante

### Añadir una nueva entrada al changelog
Crear `desarrollo/YYYY-MM-DD-titulo.md` con un `# Título` en la primera línea. Aparecerá sola en `/desarrollo/changelog`.

### Añadir una página al menú
1. Crear `src/app/.../page.tsx`.
2. Añadir el link a `src/config/nav.ts`.

### Añadir una clase, reino o cambiar marca
Solo editar el archivo correspondiente en `src/config/`.

### Cambiar el theme visual
Tokens CSS en `src/app/globals.css` (`--color-gold`, `--color-bg`, etc).

## Pendientes

- Logo y favicon reales (ahora hay placeholder de Next).
- Conectar `/api/realms` con la BD real del worldserver.
- Formulario de registro funcional con SRP6.
- Forum (Discourse embebido o propio).
- Calculadora de talentos interactiva.
- Migrar markdown renderer a `react-markdown` cuando necesitemos tablas, código resaltado, etc.

## Próximo paso recomendado

Desplegar a Vercel (subir a GitHub → conectar repo → seleccionar `web/` como root). Build limpio, todo estático, debería deployar sin tocar nada.
