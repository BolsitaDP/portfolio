# Portfolio · Santiago Giraldo

Portfolio personal de Santiago Giraldo, desarrollador web y mobile. Es un sitio estático, bilingüe (ES/EN), con estética **wabi-sabi**: papel washi, tinta sumi y un ensō que se dibuja con pincel mientras se recorre la página, hasta cerrarse con una grieta reparada en oro (kintsugi).

**En línea:** <https://bolsitadp.github.io/portfolio/>

## Stack

- [Next.js 16](https://nextjs.org) (App Router) con **export estático**, desplegado en GitHub Pages
- React 19 y TypeScript
- Tailwind CSS 4 y componentes de [shadcn/ui](https://ui.shadcn.com) (Radix)
- [three.js](https://threejs.org) para la escena de tinta (un shader a pantalla completa) y [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) para ligarla al scroll; ambos se cargan después del contenido
- [next-themes](https://github.com/pacocoursey/next-themes) para los temas washi (claro) y sumi (oscuro)
- Tipografías: Shippori Mincho, Geist, Geist Mono y Yuji Boku, vía `next/font`

## Desarrollo

Requiere Node.js 20.9 o superior y [pnpm](https://pnpm.io).

```bash
pnpm install
```

```bash
pnpm dev
```

El sitio queda en <http://localhost:3000>.

Otros comandos:

| Comando | Qué hace |
|---|---|
| `pnpm build` | Genera el sitio estático en `out/` |
| `pnpm lint` | ESLint |
| `node scripts/generate-brand-assets.mjs` | Regenera el favicon, el ícono de iOS y la firma a partir de `assets/brand/s-mark.png` |

El build necesita conexión a internet: `next/font` y la imagen para redes (`/og.png`) descargan las fuentes de Google Fonts.

> Si `pnpm dev` deja de reflejar los cambios (pasa en carpetas sincronizadas con OneDrive), detén el servidor, borra la carpeta `.next` y vuelve a iniciarlo.

## Estructura

```text
app/
  layout.tsx            fuentes, tema, metadatos y Open Graph
  page.tsx              la página: secciones en orden
  globals.css           tokens de color, tipografía y utilidades (paper-grain, ink-reveal, ink-link…)
  og.png/route.tsx      imagen para redes, generada en el build
  favicon.ico, apple-icon.png
components/
  sections/             una sección por archivo, header, dock móvil, colofón, botón de tema
  three/                fondo: montaje (three-background) y escena de tinta con su shader (ink-scene)
  ui/                   componentes de shadcn y el trazo de pincel
lib/
  portfolio-data.ts     todo el contenido: perfil, proyectos, skills, educación, experiencia
  i18n.tsx              textos de la interfaz en español e inglés
  enso-svg.ts           ensō vectorial para la imagen de redes
assets/brand/           original de la S de pincel (no se despliega)
docs/                   guía de diseño y planes
public/                 fotos y capturas (WebP)
```

## Editar el contenido

- **Proyectos, experiencia, educación, skills y perfil:** [`lib/portfolio-data.ts`](lib/portfolio-data.ts). Cada texto tiene versión `es` y `en`.
- **Textos de la interfaz** (menú, botones, títulos de sección): [`lib/i18n.tsx`](lib/i18n.tsx).
- **Imágenes:** en `public/`, en WebP. Las rutas pasan por `withBasePath` porque en producción el sitio vive bajo `/portfolio`.

## Diseño

Los principios, tokens, tipografía, patrones de layout, reglas de movimiento, parámetros de la escena de tinta y la identidad visual están en la **[guía de diseño wabi-sabi](docs/wabi-sabi-design-guide.md)**. Conviene leerla antes de agregar secciones o cambiar colores: por ejemplo, la intensidad de la tinta está limitada para que el texto cumpla WCAG AA donde cruza el ensō.

## Despliegue

Cada push a `master` dispara [el workflow de GitHub Actions](.github/workflows/deploy.yml), que construye el sitio y publica `out/` en GitHub Pages. La configuración de `basePath` está en [`next.config.ts`](next.config.ts).
