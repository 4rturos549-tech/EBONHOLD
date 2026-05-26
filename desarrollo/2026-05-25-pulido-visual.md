# 2026-05-25 · Pulido visual + iconos WoW + fix shift horizontal

## Objetivo

Resolver 3 problemas reportados:
1. **Shift horizontal** entre páginas al navegar.
2. Falta de **pulido profesional**.
3. Faltan **iconos / assets visuales** (clases, navegación).

## Cambios

### 1. Shift horizontal — RESUELTO

Causa: el scrollbar aparecía solo en páginas con contenido alto, lo que reflowaba el layout. Fix:

```css
html {
  scrollbar-gutter: stable;
}
```

Ahora todas las páginas reservan el espacio del scrollbar, no hay reflow al navegar.

### 2. Theme pulido

**Antes**: paleta sin contraste fino, hover plano, sombras genéricas, sin acentos ornamentales.

**Ahora**:
- **Background con capas radiales** (resplandor dorado sutil arriba).
- **Tipografía mejorada**: `font-feature-settings`, antialiasing, smoothing.
- **Scrollbar custom dorada** (incluso en webkit).
- **Selección de texto** en color dorado.
- **Focus visible** con outline dorado de 2px (a11y).
- **Botones gold/green con gradiente de 3 stops**, sombras internas e inferiores tipo embossed, glow sutil en hover, `transform translateY(1px)` en active.
- **Panel con hover variant** (`.panel-hover`) que cambia border + sombras + añade glow dorado.
- **Divider ornamentado** con diamante ◆ centrado sobre la línea dorada.
- **Nav items con underline animado** (línea dorada que crece debajo en hover).
- **Más respiración**: padding y gaps generosos.

### 3. Iconos y assets

**Lucide-react** instalado (~3 KB tree-shaken por icono) para iconografía UI:
- Cada item del menú tiene su icono (Sword, Hammer, Map, etc.)
- Botones del home con icono inline (Download, BookOpen, UserPlus, etc.)
- ChevronDown rota 180° al abrir un dropdown.
- ChevronRight aparece al hacer hover en items.

**Iconos oficiales de clases WoW** desde `wow.zamimg.com/images/wow/icons/large/classicon_*.jpg`:
- Es el CDN que usa Wowhead. Estándar de facto en sites de fans desde hace 15+ años.
- Configurado en `next.config.ts` → `images.remotePatterns`.
- Cargados con `<Image unoptimized>` para evitar costes de optimización serverless.

**Colores oficiales de clases** (códigos canónicos de Blizzard):
| Clase | Color |
|---|---|
| Druida | `#FF7D0A` |
| Cazador | `#ABD473` |
| Mago | `#69CCF0` |
| Paladín | `#F58CBA` |
| Sacerdote | `#FFFFFF` |
| Pícaro | `#FFF569` |
| Chamán | `#0070DE` |
| Brujo | `#9482C9` |
| Guerrero | `#C79C6E` |

Las tarjetas de clase ahora:
- Muestran el icono oficial con borde del color de la clase.
- Título en color de clase.
- Gradiente sutil del color de clase en hover (`.class-card::before`).

La página individual de clase muestra:
- Icono grande (80x80) con borde de color.
- Nombre del personaje en color de clase.
- Especializaciones en cards con borde y fondo tintado del color.

### 4. Bug fix técnico

Al pasar componentes lucide (funciones) desde server components a client components, Next.js falló con:
> Functions cannot be passed directly to Client Components unless marked with "use server"

**Solución**: refactorizar `NavDropdown` a **server component con dropdown 100% CSS** usando `group-hover:visible`. Beneficios:
- Cero JS al cliente para la navegación.
- Más rápido.
- Acepta directamente los componentes lucide como props.

## Verificación

```bash
npm run build
# ✓ Compiled successfully in 3.5s
# ✓ 41 páginas generadas estáticamente
# ✓ 0 warnings · 0 errors
```

## Lo que se siente diferente

- Al navegar, las páginas ya **no se mueven** lateralmente.
- Los **botones se sienten físicos** (sombras realistas, presión en click).
- Los **dropdowns tienen iconos** que ayudan a escanear.
- Las **clases tienen identidad visual** (color + icono oficial).
- El **foco accesible** es claramente visible (importante para teclado).
- La **scrollbar** combina con el resto.

## Pendientes para próxima iteración

- Animar la apertura del dropdown (slide-in suave).
- Iconos oficiales para razas (mismo CDN).
- Hover preview de items con tooltip estilo Wowhead.
- Background con textura noise sutil.
- Logo SVG propio (en vez del texto MASAMUNE).
