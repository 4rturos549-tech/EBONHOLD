# 📜 Desarrollo

Bitácora del proyecto. Esta carpeta cumple dos funciones:

1. **Histórico técnico** para el equipo: qué se hizo, cuándo, por qué y qué quedó pendiente.
2. **Fuente de la sección "Desarrollo › Changelog"** de la web pública (los archivos se renderizarán como Markdown).

## Estructura

- [`CHANGELOG.md`](CHANGELOG.md) — índice resumido de todas las entradas (más reciente arriba).
- `YYYY-MM-DD-titulo-slug.md` — una entrada por hito o sesión de trabajo, con detalle.

## Convenciones

- **Una entrada por hito**, no por cada commit. Si un hito ocupa varios días, una sola entrada que se va actualizando.
- **Fechas en formato ISO** (`YYYY-MM-DD`) para que ordenen alfabéticamente.
- **Slug en minúsculas y con guiones**: `2026-05-25-landing-web.md`.
- Cada entrada incluye:
  - Objetivo
  - Decisiones tomadas (con el porqué)
  - Lo que se hizo
  - Bloqueos / pendientes
  - Próximos pasos

## Versionado

Versiones `0.0.X` durante la fase de bootstrap. Pasaremos a `0.1.0` cuando exista una primera versión jugable (server arrancado + cuenta GM funcionando + web desplegada).
