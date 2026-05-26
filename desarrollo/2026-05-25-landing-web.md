# 2026-05-25 · Landing web inicial

## Objetivo

Tener la primera versión navegable de la web pública, lista para desplegar en Vercel. Diseño inspirado en [Mysteries of Azeroth](https://mysteriesofazeroth.com) (dark fantasy, dorados, navegación con dropdowns).

## Stack

- **Framework**: Next.js **16.2.6** (App Router, Turbopack)
- **React**: 19.2.4
- **Estilos**: Tailwind CSS **v4** (configuración inline en `globals.css` con `@theme inline`)
- **Tipografías**: Cinzel (display, estilo medieval) + Inter (texto), vía `next/font/google`
- **TypeScript**: 5.x
- **Lint**: ESLint con `eslint-config-next`

> ⚠️ Next.js 16 introduce cambios respecto a 15. Documentación consultada en `node_modules/next/dist/docs/01-app/01-getting-started/` antes de escribir código.

## Arquitectura

```
web/src/
├── app/
│   ├── layout.tsx       Root layout con header + footer
│   ├── page.tsx         Landing
│   └── globals.css      Theme custom (Tailwind v4 inline)
└── components/
    ├── site-header.tsx   Navbar con dropdowns
    ├── nav-dropdown.tsx  Client component (hover)
    ├── site-footer.tsx   Footer con aviso legal
    └── realm-status.tsx  Panel de estado de reinos
```

## Decisiones de diseño

### Paleta de colores (en `globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#0a0805` | Fondo principal |
| `--color-bg-panel` | `#1a1610` | Paneles |
| `--color-border` | `#3a2f1c` | Bordes |
| `--color-gold` | `#f0c060` | Acentos |
| `--color-gold-bright` | `#ffd97a` | Hover/destacados |
| `--color-text` | `#e8e0cc` | Texto principal |

### Clases utilitarias custom

- `.panel` — panel con bordes dorados y sombras interiores
- `.btn-gold` — botón estilo pergamino dorado
- `.btn-green` — botón verde (registrarse)
- `.divider-ornate` — separador dorado degradado
- `.text-gold-gradient` — texto con gradiente dorado (títulos)

### Estructura de la página de inicio

1. **Banner "Carta Abierta a Blizzard"** — clic abre `/carta-abierta`
2. **Hero principal** — título grande con gradiente dorado + descripción del servidor
3. **Sidebar derecho**:
   - Botón verde "Registrarse"
   - Botón "Únete a Discord"
   - Panel `RealmStatus` (3 reinos placeholder)
4. **Grid de noticias** — 3 placeholders

### Navegación principal

Replicando la estructura de Mysteries of Azeroth:

- **Características** › Personajes, Hermandades, Profesiones, Zonas, Mazmorras, Desafíos, Transporte, UI, Eventos
- **Clases** › Druida, Cazador, Mago, Paladín, Sacerdote, Pícaro, Chamán, Brujo, Guerrero, Calculadora
- **Desarrollo** › Base de Datos, Roadmap, Changelog, Patches, Bugs
- **Comunidad** › Foro, Discord, Hermandades
- **Medios** › Arte, Tráilers, Logos
- Links sueltos: Donar, Radio, Reglas

> Todos los dropdowns funcionan; las rutas internas son placeholders por ahora (404 hasta que creemos las páginas).

## Verificación

```bash
npm run build
# ✓ Compiled successfully in 2.4s
# ✓ TypeScript sin errores
# ✓ 4 páginas generadas estáticamente
```

## Lo que **no** hicimos todavía (intencional)

- Páginas internas (404 al hacer clic en items del menú)
- Sistema de noticias real (ahora son placeholders)
- API de estado de reinos real (está hardcodeado offline)
- Formulario de registro real (no conecta con la BD del server)
- Sistema de autenticación
- Forum
- Calculadora de talentos
- Sub-menús de "Personajes", "Profesiones" y "Transporte" (no eran prioritarios)

Estos se irán añadiendo en próximas iteraciones.

## Cómo correr en local

```bash
cd web
npm run dev
# http://localhost:3000
```

## Próximos pasos sugeridos

1. Decidir nombre definitivo del servidor (actualmente placeholder "Azeroth Eterno").
2. Crear logo + favicon real.
3. Desplegar en Vercel (conectar repo de GitHub).
4. Crear páginas internas básicas (Reglas, Donar, Cómo Empezar).
5. Empezar el launcher.
