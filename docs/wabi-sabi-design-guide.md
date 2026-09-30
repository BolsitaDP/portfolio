# Guía de diseño: wabi-sabi

> Referencia para mantener y extender el portfolio sin perder su lenguaje visual. Describe lo que existe en el código hoy: principios, tokens, tipografía, patrones de layout, movimiento, la escena de tinta y la identidad. Si cambias algo de lo que se documenta aquí, actualiza esta guía.

## 0. Resumen

El sitio es una hoja de papel (*washi*) sobre la que se lee con tinta (*sumi*). Mientras el visitante hace scroll, un **ensō** se dibuja con pincel en el fondo; al llegar al final del recorrido el círculo queda casi cerrado y aparece una **grieta reparada en oro** (*kintsugi*). El contenido no vive en tarjetas: se separa con espacio vacío, líneas finas y asimetría.

Todo parte de tres ideas:

- **Menos, pero con intención.** Un solo acento de color, un solo gesto protagonista (el ensō), sin ornamentos que no digan nada.
- **Imperfección natural.** Trazos que se secan, bordes que sangran, columnas que no se alinean del todo.
- **Calma.** Movimientos lentos, atados a la lectura, que se detienen cuando el lector se detiene.

---

## 1. Principios y cómo se aplican

| Principio | Qué significa | Dónde se ve en el sitio |
|---|---|---|
| **Ma** (間) | El espacio vacío tiene valor | Hero a pantalla completa con el nombre abajo a la izquierda; secciones con `py-20`/`py-28`; el lado derecho libre para el ensō |
| **Fukinsei** (不均斉) | Asimetría, nada perfectamente centrado | Segundo apellido con sangría; proyectos en dos columnas desfasadas; soft skills desplazadas hacia abajo; ensō fuera de centro y recortado en móvil |
| **Kanso** (簡素) | Simplicidad, quitar lo que sobra | Sin tarjetas, sin glass, sin brillos; íconos sin caja; stack como texto mono |
| **Shizen** (自然) | Naturalidad, sin artificio | Textura de papel, bordes de tinta irregulares, trazo seco (*kasure*) |
| **Sabi** (寂) | La pátina del tiempo | Capturas de proyectos desaturadas que recuperan el color al pasar el mouse |
| **Kintsugi** (金継ぎ) | Lo roto, reparado con oro, es más bello | La grieta dorada del ensō, único uso del acento dorado junto con la selección de texto |
| **Seijaku** (静寂) | Quietud | La escena deja de renderizar tras 6 s sin scroll; animaciones lentas y sin rebote |

---

## 2. Color

Todos los colores son tokens en [`app/globals.css`](../app/globals.css), en OKLCH y con tinte cálido (nunca grises puros). El tema sigue al sistema operativo y se puede cambiar con el botón del header.

| Token | Washi (claro) | Sumi (oscuro) | Uso |
|---|---|---|---|
| `--background` | `oklch(0.955 0.012 85)` | `oklch(0.19 0.008 60)` | Papel |
| `--foreground` | `oklch(0.24 0.012 60)` | `oklch(0.9 0.015 85)` | Tinta, texto principal y color del ensō |
| `--muted-foreground` | `oklch(0.45 0.015 65)` | `oklch(0.8 0.015 75)` | Texto secundario, etiquetas |
| `--border` | `oklch(0.85 0.015 75)` | `oklch(0.32 0.01 60)` | Líneas finas entre filas y secciones |
| `--card` | `oklch(0.97 0.01 85)` | `oklch(0.215 0.009 60)` | Solo el montaje de la foto y superficies elevadas |
| `--primary` | sumi | washi | Botones sólidos (poco usados) |
| `--kintsugi` | `oklch(0.72 0.12 80)` | `oklch(0.78 0.12 82)` | **Único acento**: la grieta del ensō y la selección de texto |
| `--overlay` | tinta al 35% | casi negro al 60% | Fondo de los diálogos |

Los tokens `--sidebar-*` y `--chart-*` son restos de shadcn y no se usan.

### 2.1 Contraste

El texto no solo se lee sobre papel: también cruza el trazo del ensō. El peor caso es el texto secundario sobre la parte más oscura del trazo, y está calibrado para cumplir **WCAG AA (4.5:1)**:

| | Sobre papel | Sobre el ensō (peor caso) |
|---|---|---|
| Texto principal, claro | 14.5:1 | > 10:1 |
| Texto secundario, claro | 6.5:1 | ≈ 5.0:1 |
| Texto secundario, oscuro | 9.9:1 | ≈ 4.9:1 |

El shader mezcla papel y tinta en espacio **lineal**, con una opacidad máxima de `1 − (1 − wash × 1.15) × (1 − enso)`, donde `wash` y `enso` son los valores de `INK_STRENGTH` en [`ink-scene.ts`](../components/three/ink-scene.ts). **Si subes `INK_STRENGTH` o acercas `--muted-foreground` al papel, recalcula este contraste.**

### 2.2 Colores duplicados en hex

Los generadores de imágenes no pueden leer variables CSS, así que algunos tokens están copiados en hex. Si cambias la paleta, actualízalos también:

| Hex | Token | Dónde |
|---|---|---|
| `#f4f0e7` | washi | `themeColor` en [`app/layout.tsx`](../app/layout.tsx), [`app/og.png/route.tsx`](../app/og.png/route.tsx), [`scripts/generate-brand-assets.mjs`](../scripts/generate-brand-assets.mjs) |
| `#171310` | sumi | `themeColor` en `app/layout.tsx` |
| `#241e1a`, `#5b544d`, `#cc9c42` | tinta, texto secundario, kintsugi | `app/og.png/route.tsx` |

---

## 3. Tipografía

| Familia | Rol | Cómo se aplica |
|---|---|---|
| **Shippori Mincho** (serif) | Títulos y frases destacadas | Automático en `h1`–`h4` y títulos de diálogo; `font-serif` para el resto (primera frase de "Sobre mí", soft skills, email) |
| **Geist** (sans) | Texto de lectura | Por defecto en `body` |
| **Geist Mono** | Etiquetas: ubicación, números de sección, fechas, stack, colofón | `font-mono`, casi siempre `text-xs` con `tracking-[0.2em]`–`[0.25em]` y mayúsculas para las etiquetas |
| **Yuji Boku** (pincel) | Solo el nombre en el header | `font-brush`. No usarla en más lugares: pierde fuerza |

Escala en uso:

- **h1** (hero): `text-6xl md:text-8xl`, `leading-[1.05]`, peso normal, segunda línea con `pl-[0.6em]`.
- **h2** (secciones): `text-3xl md:text-4xl`.
- **h3** (proyectos, roles): `text-xl md:text-2xl`.
- **Texto**: `text-sm` a `text-lg`, interlineado generoso (`leading-6` a `leading-8`).

Shippori Mincho y Yuji Boku son fuentes japonesas: `next/font` exporta unos **120 archivos por peso** (fragmentos por `unicode-range`). El navegador solo descarga el fragmento latino, pero el deploy crece. Por eso Shippori Mincho carga **solo el peso 400**; no agregues pesos sin necesidad.

---

## 4. Layout y espacio

- **Contenedor**: `max-w-6xl px-6`. Los bloques de texto se limitan a `max-w-2xl` para dejar el lado derecho al ensō.
- **Secciones**: `py-20 md:py-28` (contacto `md:py-32`). No hay tarjetas: se separan con espacio y, en listas, con filas de `border-border/80`.
- **Encabezado de sección** ([`SectionHeading`](../components/sections/section-heading.tsx)): número en mono (`01`–`06`), título en Mincho y un trazo de pincel ([`BrushStroke`](../components/ui/brush-stroke.tsx)) con una variante distinta según el índice.

Patrones por sección:

| Sección | Patrón |
|---|---|
| Hero | `min-h-[calc(100svh-4rem)]`, contenido abajo a la izquierda, el resto vacío para la gota de tinta inicial |
| Sobre mí | Grilla `minmax(0,1fr) 14rem`: la primera frase del resumen en Mincho grande, el resto en texto; foto montada en papel y girada 1.5° |
| Proyectos | Dos columnas; los impares bajan `md:mt-24`. El título es un botón real que cubre la tarjeta con un pseudo-elemento |
| Skills | Grilla `1.2fr 1fr`; lista con líneas finas y la segunda columna desplazada `lg:mt-16` |
| Educación / Experiencia | Línea de tiempo: `md:grid-cols-[12rem_minmax(0,1fr)]`, fecha en mono a la izquierda, guiones finos en vez de viñetas |
| Contacto | Email grande en Mincho, al lado del ensō terminado |
| Colofón | © y la S de pincel como firma, como el sello de una pintura sumi-e |

---

## 5. Utilidades y componentes

Utilidades definidas en [`app/globals.css`](../app/globals.css):

| Utilidad | Qué hace | Dónde se usa |
|---|---|---|
| `paper-grain` | Textura de papel con `feTurbulence` inline; opacidad y modo de mezcla cambian por tema | Fondo ([`ThreeBackground`](../components/three/three-background.tsx)) |
| `ink-reveal` | El contenido aparece (opacidad y desplazamiento) al entrar en pantalla; animación ligada al scroll | Bloques de contenido y encabezados |
| `brush-draw` | Dibuja el elemento de izquierda a derecha (`clip-path`) con el scroll | Trazo bajo los títulos |
| `ink-link` | Pincelada bajo el enlace en hover o foco de teclado; dentro de un `.group`, se dibuja al pasar por todo el grupo | Menú, email, LinkedIn, "Ver detalles" |
| `ink-dialog` | El diálogo se abre como una gota que se expande (`clip-path: circle`) | [`DialogContent`](../components/ui/dialog.tsx) |

Componentes propios: `SectionHeading`, `BrushStroke` (tres trazos distintos para que los títulos no se vean estampados), [`ThemeToggle`](../components/sections/theme-toggle.tsx) y [`SiteFooter`](../components/sections/site-footer.tsx).

---

## 6. Movimiento

Una sola curva para todo: `--brush-curve: cubic-bezier(0.22, 0.61, 0.36, 1)`, disponible en Tailwind como `ease-brush`. Arranca decidida y se posa despacio, como un pincel.

| Interacción | Duración |
|---|---|
| Cambios de color en hover | 500 ms |
| Capturas de proyectos (color y escala al pasar el mouse) | 1000 ms |
| Pincelada de `ink-link` | 650 ms |
| Diálogo: apertura / cierre | 600 ms / 220 ms |
| Cambio de tema (tinta desde el botón) | 700 ms |
| Ensō siguiendo el scroll (GSAP `scrub`) | 0.6 s de arrastre |
| `ink-reveal`, `brush-draw` | Ligadas al scroll, sin duración fija |

Reglas:

- **Sin rebotes, resortes ni sobrepasos.** Nada salta.
- **Preferir movimiento ligado a la lectura** (scroll) antes que temporizadores.
- **CSS primero.** Solo el cambio de tema usa JS (View Transitions API).
- **Todo respeta `prefers-reduced-motion`**: el revelado y el trazo aparecen completos, la pincelada de los enlaces aparece sin transición, el diálogo y el tema cambian al instante, y el ensō se muestra terminado y quieto.

---

## 7. La escena de tinta

Archivos: [`components/three/three-background.tsx`](../components/three/three-background.tsx) (montaje) y [`components/three/ink-scene.ts`](../components/three/ink-scene.ts) (escena y shader).

**Cómo funciona.** `ThreeBackground` carga three.js y GSAP con `import()` dinámico, así que no forman parte del JS inicial. GSAP ScrollTrigger convierte el scroll de la página en un valor `scrollProgress` de 0 a 1. `createInkScene` dibuja un único plano a pantalla completa con un shader de fragmentos que pinta:

1. **Nubes de tinta diluida** que derivan lentamente (fbm con distorsión de dominio), con el pigmento acumulado en los bordes.
2. **El ensō**, trazado en sentido horario desde `START_ANGLE` hasta cubrir el 90% del círculo según el progreso: radio que titubea y se cierra en espiral, presión que engorda y adelgaza, bordes que sangran, trazo seco al final y tinta acumulada en los bordes.
3. **La gota inicial**, donde el pincel toca el papel; visible antes de hacer scroll.
4. **El kintsugi**, una grieta dorada en `CRACK_ANGLE` que aparece entre el 84% y el 100% del progreso.

Parámetros para ajustar:

| Constante | Valor | Efecto |
|---|---|---|
| `ENSO_LAYOUT` | escritorio `x 0.5, y 0.04`; móvil `x 0.35, y 0.12` | Posición del centro (x como fracción de medio ancho) |
| `INK_STRENGTH` | claro `0.22 / 0.045`; oscuro `0.07 / 0.006` | Opacidad del ensō / de las nubes. Limitada por contraste (ver 2.1) |
| `START_ANGLE` | `1.1` rad | Dónde aterriza el pincel (arriba a la derecha) |
| `CRACK_ANGLE` | `0.15` rad | Dónde cae la grieta (en la parte gruesa, lado derecho) |
| `SCROLL_FRAME_MS` / `IDLE_FRAME_MS` | ~60 fps / 24 fps | Ritmo al hacer scroll / mientras las nubes derivan |
| `SETTLE_AFTER_MS` | `6000` | Tras este tiempo sin scroll la tinta se asienta y no se renderiza nada |
| `MAX_BUFFER_PIXELS` | `1.2 MP` | Techo de resolución en pantallas grandes (el navegador escala) |
| `OCTAVES` | 5 escritorio, 4 móvil | Detalle del ruido |

**Rendimiento.** Medido en una RTX 3060 a 1920×991: de ~1.1 ms a **0.33 ms por frame** tras las optimizaciones. El trazo, la gota y la grieta solo se calculan en la franja del anillo (`0.65R`–`1.3R`); **si cambias el ancho del trazo o el radio, revisa esos límites**. En GPUs integradas o móviles de gama baja todavía no está medido.

**Tema.** La escena lee sus colores de los tokens CSS al crearse y se reconstruye cuando cambia la clase `dark` del `<html>` ([`useIsDarkTheme`](../lib/hooks/use-is-dark-theme.ts)). No usa `resolvedTheme` de next-themes: ese valor cambia antes de que la clase se aplique, y la escena leería los colores del tema anterior.

**Degradación.** Sin WebGL solo queda el papel con su textura. Con movimiento reducido se muestra el ensō terminado, sin seguir el scroll.

---

## 8. Identidad

- **Marca**: la **S de pincel**. El original de 1024 px está en [`assets/brand/s-mark.png`](../assets/brand/s-mark.png) (no se despliega). El favicon (16/32/48 px, sobre una base washi para que se vea en pestañas oscuras), el ícono de iOS y la firma del colofón se generan con:

  ```bash
  node scripts/generate-brand-assets.mjs
  ```

- **Imagen para redes (Open Graph)**: se genera en el build desde [`app/og.png/route.tsx`](../app/og.png/route.tsx). Repite el hero (ubicación, nombre, rol) con un ensō vectorial de [`lib/enso-svg.ts`](../lib/enso-svg.ts), que sigue el mismo perfil de pincel que el shader: **si cambias la forma del trazo en uno, actualiza el otro**. Es un route handler y no la convención `opengraph-image` porque esta última se exporta sin extensión y GitHub Pages la serviría como `application/octet-stream`. Las fuentes se descargan de Google Fonts durante el build.
- **El ensō** es el gesto del sitio y de la imagen para redes; **la S** es la firma. No mezclarlos en una sola pieza.

---

## 9. Imágenes

- Formato **WebP**, convertidas con `sharp` (viene con Next.js).
- Capturas de proyectos: resolución original (~1400 px de ancho, el diálogo las muestra cerca de 900 px), calidad 80.
- Fotos: al doble del tamaño en pantalla.
- Las capturas se muestran con `grayscale-60 sepia-20` y recuperan el color al pasar el mouse, así que se pueden usar capturas muy saturadas.

---

## 10. Accesibilidad

- Contraste AA, también sobre el ensō (ver 2.1).
- Foco visible: la pincelada de `ink-link` también aparece con foco de teclado.
- Los títulos de proyecto son botones reales (se abren con teclado).
- El botón de idioma tiene texto para lectores de pantalla que conserva la etiqueta visible ("EN"/"ES") en su nombre accesible.
- "Copiar email" confirma con una región `role="status"`.
- `prefers-reduced-motion` respetado en todo (ver 6).
- `<meta name="darkreader-lock">`: el sitio tiene modo oscuro propio y Dark Reader no puede recolorear el canvas, lo que dejaba la interfaz y el fondo desparejos.

---

## 11. Qué evitar

- Glassmorphism, `backdrop-blur`, brillos o sombras de color.
- Grises puros: todo neutro lleva un tinte cálido.
- Un segundo color de acento. El oro es el único y se usa con mucha moderación.
- Rebotes, resortes, zooms llamativos, movimientos rápidos.
- Tarjetas para todo; si algo necesita separación, primero probar con espacio.
- Clichés "japoneses": cerezos, torii, kanjis decorativos sin significado.
- Formas geométricas perfectas como ornamento: si hay un trazo, que parezca hecho a mano.
- Más fuentes de pincel o más pesos de las fuentes japonesas.

---

## 12. Pendientes

- Medir la escena en un teléfono y en una laptop con GPU integrada.
- Correr Lighthouse sobre el build (`out/`).
- Tras el deploy, validar la vista previa en el Post Inspector de LinkedIn o el Sharing Debugger de Facebook.
- `theme-color` sigue al sistema operativo, no al botón de tema (limitación del estándar).
- [`components/ui/card.tsx`](../components/ui/card.tsx) ya no se usa.
- El workflow de deploy instala con `npm install` sin lockfile, mientras el proyecto usa pnpm.
