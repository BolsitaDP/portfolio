# Plan: Migración del portfolio a Three.js

> Documento de planeación. No implica cambios de código — es la base para decidir alcance, dirección creativa y arquitectura antes de tocar nada.

## 0. Resumen

El portfolio actual es un sitio Next.js de una sola página (App Router, export estático) con un fondo animado a base de una **secuencia de imágenes** (efecto "scroll-scrubbing" estilo Apple) y secciones de contenido clásicas (About, Proyectos, Skills, Educación, Experiencia, Contacto) con soporte bilingüe ES/EN. La idea es reemplazar/evolucionar esa pieza visual central — y potencialmente más — usando **three.js** para pasar de una animación pre-renderizada a una escena 3D real, interactiva y ligada al scroll.

Este documento resume la esencia de lo que existe hoy, qué conviene conservar, qué se gana con three.js, opciones de alcance/dirección creativa, y una propuesta de arquitectura y roadmap.

---

## 1. La esencia de lo que hay hoy

### 1.1 Stack técnico
- **Next.js 16** (App Router) + **React 19** + **TypeScript**.
- **Tailwind CSS 4** + **shadcn/ui** (sobre Radix) para todos los componentes de UI (`Card`, `Dialog`, `Badge`, `Button`, `Sonner` toasts).
- **GSAP + ScrollTrigger** ya está integrado — es la pieza que hoy sincroniza scroll con la animación de fondo.
- **next-themes** está instalado pero el sitio fuerza `className="dark"` en `<html>` — hoy es dark-only.
- i18n propio (sin librería), contexto React con diccionario ES/EN y persistencia en `localStorage`.
- **Export estático** (`output: "export"` en [next.config.ts](../next.config.ts)) desplegado a **GitHub Pages** vía Actions ([deploy.yml](../.github/workflows/deploy.yml)), con `basePath`/`assetPrefix` = `/portfolio`. Esto es una restricción dura: **no hay servidor**, todo corre en el cliente y las rutas de assets deben pasar por `withBasePath` / `APP_BASE_PATH`.

### 1.2 Modelo de contenido
Todo el contenido vive centralizado y tipado en [lib/portfolio-data.ts](../lib/portfolio-data.ts): `profile`, `projects`, `skills`, `softSkills`, `experience`, `education`, todos con textos `{ es, en }` (`LocalizedText`). Los componentes de sección son puramente de presentación y consumen estos datos + el hook `useI18n()`. Esto es un activo importante: **separa contenido de presentación**, así que cualquier rediseño (three.js o no) puede reusar los datos tal cual.

### 1.3 Estructura de secciones (IA del sitio)
Una sola página (`app/page.tsx`) con secciones ancladas por `id`, navegación por hash:
`Home → About → Projects → Skills → Education → Experience → Contact`.

Navegación: `SiteHeader` (desktop, sticky top) + `MobileDock` (dock inferior fijo estilo iOS, solo mobile). Los proyectos abren detalle en un `Dialog` (modal) con imagen, descripción larga, stack y highlights.

### 1.4 La pieza visual central: `ScrollSequenceBackground`
Esto es lo que hoy hace de "wow factor" y es el candidato natural a reemplazar por three.js:

- Un `<canvas>` 2D fijo (`position: fixed`, detrás de todo el contenido) que dibuja frame por frame una **secuencia de 120 imágenes WebP** (una para desktop, otra para mobile — carpetas separadas, ~4.2 MB en total).
- GSAP `ScrollTrigger` mapea el scroll total de la página (`top top` → `scrollHeight - innerHeight`) a un tween de `frame: 0 → 119`, con `scrub` y `snap: "frame"`. Es decir: **el scroll controla qué frame se dibuja**, simulando una animación cinemática (como el scroll de producto de Apple).
- Encima del canvas hay overlays: blur/opacity/saturate vía clases Tailwind, un scrim con el color de fondo, gradientes radiales de `--primary`/`--accent`, y un fade a negro hacia abajo.
- Los frames son **pre-renderizados** (probablemente exportados desde una animación 3D externa, After Effects, o similar) — no hay geometría, cámara ni luces reales en el navegador; es video disfrazado de imágenes.

### 1.5 Identidad visual / tono
- Tema oscuro forzado, paleta neutra shadcn (grises/negros en OKLCH), cards con bordes sutiles y `radius` consistente.
- Tipografía: Geist Sans/Mono para texto, **Yuji Boku** (fuente decorativa japonesa) solo para el nombre en el header — un detalle de personalidad que vale la pena conservar o evolucionar.
- Un toque personal ya existe: la foto de perfil en About usa una máscara de gradiente y drop-shadow — señal de que ya hay apetito por tratamientos visuales no genéricos.

### 1.6 Restricción de despliegue (clave para la arquitectura de three.js)
Al ser export estático a GitHub Pages:
- Todo three.js debe ejecutarse **100% client-side** (ya es así por naturaleza — sin problema).
- Los assets 3D (modelos `.glb/.gltf`, texturas, HDRIs) se sirven como archivos estáticos desde `/public`, igual que las imágenes hoy — pero cuidado con el `basePath` (`withBasePath`) al referenciarlos.
- No hay optimización de imágenes de Next (`images.unoptimized: true`) ni funciones serverless — cualquier procesamiento (compresión de modelos, generación de LODs) debe hacerse en build-time/localmente, no en runtime de servidor.
- El tamaño del bundle y de los assets importa mucho más que en un sitio con servidor: GitHub Pages es solo CDN estático, sin control de caching fino más allá de lo default.

---

## 2. Diagnóstico honesto

**Lo que funciona y hay que proteger:**
- Modelo de datos + i18n desacoplado de la presentación.
- La idea narrativa del scroll-driven storytelling (ya está, solo está resuelta con "video falso" en vez de 3D real).
- Estructura de información clara y con buen copy (proyectos con contexto real, no genérico).
- El toque de personalidad tipográfico (Yuji Boku) y el gesto de la foto con máscara.

**Limitaciones del enfoque actual que three.js puede resolver:**
- La secuencia de imágenes es **fija**: no reacciona al mouse, no tiene profundidad real, no se puede reencuadrar por breakpoint sin regenerar 240 imágenes.
- Cambiar la animación hoy significa re-renderizar y exportar 120 frames de nuevo en una herramienta externa — no es editable desde el código.
- No hay interactividad real (parallax de cursor, hover en objetos 3D, cámara que responda).
- El resto del sitio (cards, proyectos) es 100% "flat UI" — no hay conexión visual entre el hero 3D y el resto del contenido.

---

## 3. Visión: qué gana el sitio con three.js

En vez de un video pre-grabado, una **escena 3D real** en el navegador permite:
- Cámara y objetos controlados por scroll (mismo mental model que hoy con GSAP, pero con geometría real en vez de frames).
- Reactividad: parallax al mover el mouse, hover states en objetos 3D, transiciones entre "escenas" al cambiar de sección.
- Reutilización de una sola escena para múltiples momentos del sitio (ej. la misma escena "respira" distinto en Home vs. Projects) sin necesitar nuevas imágenes.
- Mejor identidad de marca: un lenguaje visual propio (formas, materiales, iluminación) en vez de una animación genérica de stock/plantilla.
- Tamaño de assets potencialmente menor (un modelo `.glb` bien optimizado puede pesar menos que 240 WebP) — a cambio de más costo de GPU/CPU en el cliente.

---

## 4. Decisiones de alcance

### Opción A — "Hero 3D" (alcance conservador)
Reemplazar únicamente `ScrollSequenceBackground` por una escena three.js equivalente: mismo rol (fondo fijo, scroll-scrubbed), pero con geometría/cámara real en vez de frames. El resto del sitio (cards, secciones, dock) queda igual.
- **Esfuerzo:** medio. **Riesgo:** bajo. **Impacto visual:** alto donde más se nota (primera impresión), sin tocar el resto.

### Opción B — "Scroll-driven storytelling" ✅ **Elegida**
La escena 3D no es solo un fondo: acompaña y reacciona al contenido de cada sección (ej. la estructura 3D se reconfigura al llegar a Projects, se agrupa en clústeres al llegar a Skills, etc.). Requiere coordinar three.js con las secciones de contenido, no solo con el scroll total de la página.
- **Esfuerzo:** alto. **Riesgo:** medio (más superficie de bugs de sincronización). **Impacto:** el sitio se siente como un producto, no como una página con un fondo bonito.
- **Implicación práctica:** aunque el alcance final es B, conviene construirlo de forma incremental — la Fase 1 del roadmap (§7) entrega una versión "hero-only" ya funcional (equivalente a A) como base, y las fases siguientes le añaden reactividad por sección hasta llegar a B completo. Así siempre hay algo desplegable, en vez de un big-bang.

### Opción C — "WebGL-first" (alcance ambicioso, no elegido por ahora)
Repensar secciones completas como parte de la escena 3D (ej. proyectos como objetos 3D navegables/seleccionables en vez de cards planas). Cambia sustancialmente la interacción y probablemente la accesibilidad/SEO requieren más trabajo compensatorio (contenido real en el DOM además del canvas).
- **Esfuerzo:** muy alto. **Riesgo:** alto (performance en mobile, accesibilidad, tiempo de desarrollo).
- Queda como posible evolución futura si Opción B queda sólida y hay apetito de seguir iterando — no es parte del alcance actual.

---

## 5. Dirección creativa — concepto elegido

### ✅ Constructo / grid de código

Una estructura 3D tipo circuito/grid (líneas, nodos, planos delgados — sin modelado orgánico, todo geometría procedural: `LineSegments`, `InstancedMesh` para nodos, materiales tipo wireframe/emisivo) que **vive durante todo el recorrido de scroll y se reconfigura según la sección activa**. Conecta directamente con "arquitectura frontend" del summary de perfil y es barata en assets (nada de modelos externos, todo generado por código + shaders), lo cual encaja bien con la restricción de export estático.

**Arco narrativo propuesto por sección** (esto es la base de la Opción B elegida en §4 — cada sección no solo "tiene" la escena de fondo, le da una instrucción de reconfiguración):

| Sección | Estado del grid | Intención |
|---|---|---|
| **Home** | Disperso, incompleto, algunos nodos apagados — se enciende progresivamente al entrar | "Todo empieza a construirse" |
| **About** | Se organiza en una forma más coherente/simétrica, cámara se acerca | Foco personal, orden |
| **Projects** | Se fragmenta en 3–4 clústeres discretos (uno por proyecto); al hacer hover/abrir un proyecto en el DOM, el nodo/clúster correspondiente puede resaltarse | Cada proyecto = un módulo tangible |
| **Skills** | Los nodos se agrupan por "categoría" (frontend/mobile/tools) formando sub-redes que pulsan | Red de conocimiento |
| **Education / Experience** | El grid se estira en profundidad (eje Z) formando una secuencia — la cámara avanza "hacia adentro" a medida que se hace scroll (aquí se reusa la idea de timeline espacial como sub-comportamiento del mismo grid, no como concepto aparte) | Línea de tiempo de carrera |
| **Contact** | El grid converge hacia un único punto/nodo brillante, se calma (menos movimiento, menos partículas) | Cierre, punto de contacto |

Técnicamente esto se resuelve con **una sola escena persistente** (no una escena distinta por sección) cuyos parámetros (posición de cámara, dispersión de nodos, color/intensidad emisiva, agrupación) están controlados por un timeline de GSAP con **labels por sección**, sincronizado a `ScrollTrigger` con `start`/`end` propios de cada `<section>` — en vez del tween único 0→119 que existe hoy. Esto es más trabajo que un hero estático, pero es exactamente el patrón que hace falta para la Opción B.

**Notas de estilo:** paleta ligada a los tokens `oklch` actuales (grises neutros + acentos `--primary`/`--accent`), líneas finas con leve glow (bloom sutil, no excesivo), nunca debe competir visualmente con el texto de las cards — debe sentirse como estructura de fondo, no como protagonista que tapa el contenido.

---

## 6. Propuesta de arquitectura técnica

### 6.1 Librerías
- **three.js** como motor base (ya no hay vuelta atrás, es la base de todo el ecosistema React).
- **@react-three/fiber** (R3F) + **@react-three/drei**: recomendado sobre three.js "vanilla" porque el resto del sitio ya es React/Next — permite componer la escena como componentes, reusar estado de React (idioma, sección activa, tema) y mantener un solo mental model. Drei aporta helpers ya resueltos (`useGLTF`, `Environment`, `ScrollControls`, `PerformanceMonitor`).
- **GSAP + ScrollTrigger** se mantiene: sigue siendo la mejor herramienta para mapear scroll → valores (posición de cámara, progreso de timeline), y ya está integrado y probado en el proyecto. R3F no compite con esto, se combinan (GSAP anima variables que la escena de R3F lee).
- Opcional más adelante: `@react-three/postprocessing` para bloom/grain si el concepto lo pide; `zustand` si el estado de la escena (sección activa, progreso) crece y conviene sacarlo de contexto React puro.

### 6.2 Integración con el export estático de Next
- R3F/three.js funcionan sin problema con `output: "export"` porque todo se monta client-side (`"use client"`, igual que hoy `ScrollSequenceBackground`). No se necesita cambiar `next.config.ts`.
- Los assets 3D van a `public/`, referenciados con `withBasePath()` igual que las imágenes de proyectos hoy — mismo patrón, no hay que inventar nada nuevo.
- Precaución con SSR: el canvas de three.js debe montarse solo en cliente (dynamic import con `ssr: false` o `useEffect`), igual que el patrón actual.

### 6.3 Reemplazo del pipeline de assets
Hoy: 240 WebP (secuencia pre-renderizada). Con three.js, el pipeline cambia a:
- Modelos `.glb` optimizados (Draco/Meshopt compression) si el concepto usa geometría (opciones 2 o 4).
- Texturas comprimidas (KTX2/Basis) si aplica.
- O, si el concepto es shader/partículas (opción 3), casi no hay assets binarios — todo es código (shaders GLSL), lo cual es ideal para mantener el repo liviano y todo versionable como texto.
- Se puede borrar la carpeta `public/animations` una vez migrado (libera ~4.2 MB y 240 archivos).

### 6.4 Performance y fallbacks (crítico para un sitio público)
- **`prefers-reduced-motion`**: debe existir un fallback estático (imagen o escena sin animación) — hoy el sitio no lo respeta explícitamente, es buen momento de agregarlo.
- **Detección de WebGL / GPU débil**: fallback a una imagen estática o gradiente si `WebGLRenderer` falla o si `navigator.hardwareConcurrency`/heurísticas indican un dispositivo muy limitado (esto ya es más relevante que con la secuencia de imágenes, que corre en cualquier navegador).
- **Mobile primero**: la versión mobile debe ser deliberadamente más simple (menos partículas/polígonos, sin postprocessing) — igual que hoy ya existe una secuencia "mobile" separada, el patrón de "dos calidades" ya es familiar en este proyecto.
- **Presupuesto de rendimiento**: fijar un objetivo explícito (ej. 60fps en desktop de gama media, degradar a 30fps o estático en mobile de gama baja) antes de elegir la complejidad del concepto.

### 6.5 Accesibilidad y SEO
- El canvas sigue siendo `aria-hidden="true"` (decorativo) — el contenido real (texto, proyectos, contacto) sigue viviendo en HTML normal, como hoy. Esto es una ventaja de la Opción A/B sobre la C: no se sacrifica accesibilidad ni SEO del contenido.
- Si se avanza a Opción C (contenido dentro del canvas), hay que duplicar ese contenido en el DOM (oculto visualmente pero accesible) — costo adicional a tener en cuenta.

---

## 7. Roadmap propuesto por fases

El alcance final es la Opción B (grid reactivo por sección), pero se construye incrementalmente para tener siempre algo estable desplegado:

1. **Fase 0 — Spike/prototipo (sin comprometer el main):** rama aparte, instalar three.js + R3F, montar una escena mínima (grid/líneas básicas con luces) reemplazando temporalmente el canvas actual, validar que el export estático + GitHub Pages siguen funcionando igual. Objetivo: de-risk técnico, no visual.
2. **Fase 1 — Grid base, calidad "hero":** implementar el grid procedural (§5) como reemplazo real de `ScrollSequenceBackground`, con un único scroll-binding global (equivalente a Opción A), versión desktop y mobile, fallback `prefers-reduced-motion`/no-WebGL. Entregable desplegable por sí solo.
3. **Fase 2 — Reactividad por sección (Opción B):** reemplazar el tween único por un timeline de GSAP con labels/`ScrollTrigger` por `<section>`, implementando las transiciones de la tabla de §5 (Home → About → Projects → Skills → Education/Experience → Contact) una por una, empezando por Home/About y avanzando en orden.
4. **Fase 3 — Puentes de interacción DOM↔escena:** conectar eventos del DOM (hover/click en project cards, toggle de idioma, etc.) con la escena — ej. resaltar el clúster correspondiente al abrir un proyecto.
5. **Fase 4 — Pulido y performance:** profiling en dispositivos reales de gama media/baja, ajustar densidad de nodos/líneas, lazy-load del bundle de three.js (no bloquear el first paint del contenido), Lighthouse pass.
6. **Fase 5 — Limpieza:** eliminar `public/animations` y el código de `ScrollSequenceBackground`, actualizar README si aplica.

---

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Peso de bundle (three.js + R3F + drei) infla el JS inicial | Code-splitting/dynamic import del canvas 3D; tree-shaking cuidadoso de drei (importar solo lo usado) |
| Mal rendimiento en móviles de gama baja | Presupuesto de perf definido desde el diseño del concepto; versión mobile deliberadamente más simple (patrón ya usado hoy) |
| Regresión de accesibilidad/SEO | Mantener contenido real en HTML (Opción A/B); solo ir a C con plan de duplicar contenido accesible |
| Sobre-alcance / nunca converge | Fases claras con Fase 1 como "listo para producción" antes de considerar Fase 3 |
| Mantenimiento futuro más complejo que la secuencia de imágenes | Documentar la escena (parámetros, cómo ajustar) — un README corto en `components/three/` cuando exista código |

---

## 9. Checklist de preparación (antes de escribir código)

- [x] Elegir concepto creativo (§5) → **Grid/constructo de código**, reactivo por sección.
- [x] Confirmar alcance inicial (§4) → **Opción B**, construida incrementalmente desde una base tipo Fase 1.
- [ ] Decidir si se conserva dark-only o se reabre soporte de tema claro (afecta paleta de la escena 3D).
- [ ] Confirmar el mapeo detallado sección→estado del grid (la tabla de §5 es una propuesta inicial, se puede ajustar).
- [ ] Definir dispositivos/gama mínima objetivo para pruebas de performance.
- [ ] Decidir three.js vanilla vs. React Three Fiber (recomendación de este documento: R3F, por consistencia con el stack React existente).

## 10. Preguntas abiertas para la siguiente conversación

1. ¿La tabla de arco narrativo por sección (§5) refleja lo que imaginas, o algún tramo (ej. Projects, Skills) debería comportarse distinto?
2. ¿Confirmamos React Three Fiber + drei, o prefieres three.js vanilla (más control de bajo nivel, más código boilerplate)?
3. ¿Seguimos dark-only o vale la pena reabrir un tema claro para la escena también?
4. ¿Arrancamos ya con la Fase 0 (spike técnico en una rama aparte) o prefieres revisar/ajustar este documento primero?
