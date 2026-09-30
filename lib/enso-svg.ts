// Vector ensō for static images (Open Graph). It follows the same brush
// profile as the shader in components/three/ink-scene.ts: a heavy landing at
// the upper right, a clockwise swell, dry-brush streaks as the ink runs out,
// an open gap, and a gold-mended crack across the stroke.

type EnsoSvgOptions = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  radius: number;
  ink: string;
  inkOpacity: number;
  gold: string;
};

const START = -1.1; // SVG y points down, so this is the upper right
const SWEEP = Math.PI * 2 * 0.9;
const STEPS = 180;
const BRISTLES = 11;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Deterministic, so every build produces the same image.
function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function brushAt(t: number, radius: number) {
  const landing = 0.35 * (1 - smoothstep(0, 0.05, t));
  const pressure = 0.75 + 0.35 * Math.sin(Math.PI * Math.min(t / 0.55, 1));
  const runOut = 1 - 0.45 * smoothstep(0.35, 0.95, t);
  const lift = 0.3 + 0.7 * (1 - smoothstep(0.83, 1, t));
  const wander = 0.03 * Math.sin(t * 9.1 + 1.3) + 0.015 * Math.sin(t * 23.7);

  return {
    angle: START + t * SWEEP,
    r: radius * (1 + wander - 0.07 * t),
    halfWidth: radius * 0.11 * (pressure * runOut + landing) * lift,
  };
}

type Edge = (t: number, step: number) => number;

// A ribbon between two edges across the stroke (-1 inner edge, 1 outer),
// each a function of the position along the stroke.
function ribbon(cx: number, cy: number, radius: number, from: number, to: number, lo: Edge, hi: Edge) {
  const outer: string[] = [];
  const inner: string[] = [];
  const steps = Math.max(2, Math.round(STEPS * (to - from)));

  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    const { angle, r, halfWidth } = brushAt(t, radius);
    const point = (offset: number) => {
      const d = r + offset * halfWidth;
      return `${(cx + d * Math.cos(angle)).toFixed(1)} ${(cy + d * Math.sin(angle)).toFixed(1)}`;
    };
    outer.push(point(hi(t, i)));
    inner.unshift(point(lo(t, i)));
  }

  return `M${outer.join("L")}L${inner.join("L")}Z`;
}

// Ink soaks unevenly into paper, so no edge is a clean curve.
const rough = (seed: number, amount: number) => (_t: number, step: number) =>
  (hash(step * 13 + seed * 7) - 0.5) * amount;

export function ensoSvg({ width, height, cx, cy, radius, ink, inkOpacity, gold }: EnsoSvgOptions) {
  // Wet body that tapers into the bristles instead of stopping short.
  const bodyTaper = (t: number) => smoothstep(0.45, 0.62, t);
  const body = ribbon(
    cx, cy, radius, 0, 0.62,
    (t, i) => -1 + bodyTaper(t) + rough(1, 0.08)(t, i),
    (t, i) => 1 - bodyTaper(t) + rough(2, 0.08)(t, i),
  );

  // Bristles run the whole stroke; the gaps between them open as the ink runs
  // out, and each one dries up at its own point.
  const bounds = Array.from({ length: BRISTLES + 1 }, (_, i) =>
    i === 0 ? -1 : i === BRISTLES ? 1 : -1 + (2 * i) / BRISTLES + (hash(i) - 0.5) * 0.1,
  );
  const gap = (t: number) => 0.075 * smoothstep(0.4, 0.85, t);
  const bristles = bounds.slice(0, -1).map((lo, i) => {
    const hi = bounds[ i + 1 ];
    const end = 1 - 0.3 * hash(i + 7) ** 1.5;
    return ribbon(
      cx, cy, radius, 0.3, end,
      (t, step) => lo + gap(t) + rough(i + 10, 0.05)(t, step),
      (t, step) => hi - gap(t) + rough(i + 30, 0.05)(t, step),
    );
  });

  const landing = brushAt(0, radius);
  const capX = cx + landing.r * Math.cos(landing.angle);
  const capY = cy + landing.r * Math.sin(landing.angle);
  const capAngle = ((landing.angle + Math.PI / 2) * 180) / Math.PI;

  // Kintsugi: a jagged line straight across the stroke, early in the swell.
  const crackAt = brushAt(0.18, radius);
  const crack = Array.from({ length: 8 }, (_, i) => {
    const offset = -1 + (2 * i) / 7;
    const d = crackAt.r + offset * crackAt.halfWidth;
    const angle = crackAt.angle + (hash(i + 20) - 0.5) * 0.03;
    return `${(cx + d * Math.cos(angle)).toFixed(1)} ${(cy + d * Math.sin(angle)).toFixed(1)}`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<g fill="${ink}" opacity="${inkOpacity}">
<path d="${body}"/>
<path d="${bristles.join("")}"/>
<ellipse cx="${capX.toFixed(1)}" cy="${capY.toFixed(1)}" rx="${(landing.halfWidth * 1.12).toFixed(1)}" ry="${(landing.halfWidth * 0.94).toFixed(1)}" transform="rotate(${capAngle.toFixed(1)} ${capX.toFixed(1)} ${capY.toFixed(1)})"/>
</g>
<path d="M${crack.join("L")}" fill="none" stroke="${gold}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;
}
