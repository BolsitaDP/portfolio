import * as THREE from "three";
import { resolveCssColor } from "@/lib/three/resolve-css-color";
import { scrollProgress } from "@/lib/three/scroll-progress";

// Positions live in aspect-corrected screen space: y spans [-0.5, 0.5] and x
// spans ±aspect / 2. `x` is a fraction of the half width so the ensō keeps its
// off-center placement (and its crop on narrow screens) at any aspect ratio.
const ENSO_LAYOUT = {
  desktop: { x: 0.5, y: 0.04 },
  mobile: { x: 0.35, y: 0.12 },
} as const;

const INK_STRENGTH = {
  light: { enso: 0.24, wash: 0.045 },
  dark: { enso: 0.09, wash: 0.006 },
} as const;

// Scroll renders at most ~60fps, even on 120Hz screens. Between scrolls the
// ink keeps drifting at a lower rate, and once the reader has been still for a
// while it settles and nothing is rendered at all.
const SCROLL_FRAME_MS = 1000 / 60 - 1;
const IDLE_FRAME_MS = 1000 / 24;
const SETTLE_AFTER_MS = 6000;

// Ink is soft by nature, so large screens render fewer pixels than they show
// and let the browser upscale; phones stay at 1x.
const MAX_BUFFER_PIXELS = 1_200_000;

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uAspect;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform vec3 uGold;
  uniform float uInkStrength;
  uniform float uWashStrength;

  varying vec2 vUv;

  #define TAU 6.28318530718
  #define START_ANGLE 1.1
  #define CRACK_ANGLE 0.15

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbmCoarse(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.02 + 17.3;
      amplitude *= 0.5;
    }
    return value;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.02 + 17.3;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float progress = clamp(uProgress, 0.0, 1.0);

    // Diluted sumi drifting across the paper; scrolling slides it like parallax.
    // Pigment gathers at the edge of each pool, as it does when ink dries.
    vec2 q = p * 1.8 + vec2(0.0, progress * 1.5);
    vec2 warp = vec2(
      fbmCoarse(q + vec2(0.0, uTime * 0.02)),
      fbmCoarse(q + vec2(5.2, 1.3) - vec2(uTime * 0.015, 0.0))
    );
    float cloud = fbm(q + 1.6 * warp);
    float washBody = smoothstep(0.56, 0.84, cloud);
    float washEdge = smoothstep(0.54, 0.57, cloud) * (1.0 - smoothstep(0.57, 0.65, cloud));
    float wash = (washBody * 0.7 + washEdge * 0.45) * uWashStrength;

    // Ensō: one brush stroke drawn clockwise as the page is read.
    vec2 center = uCenter + vec2(0.0, (progress - 0.5) * 0.1);
    vec2 d = p - center;
    float r = length(d);
    float enso = 0.0;
    float gold = 0.0;

    // The stroke, its blot and the crack all live within 0.7R–1.25R of the
    // center, so the rest of the screen (most of it) skips their noise.
    if (r > uRadius * 0.65 && r < uRadius * 1.3) {
      float angle = atan(d.y, d.x);
      float t = fract((START_ANGLE - angle) / TAU);
      float drawn = mix(0.02, 0.9, smoothstep(0.02, 0.92, progress));

      // The hand is never exact: the radius wanders and slowly spirals inward,
      // so the end of the stroke never quite meets its start.
      float wander = (noise(vec2(t * 6.0, 1.7)) - 0.5) * 0.06;
      float ringRadius = uRadius * (1.0 + wander - 0.07 * t);

      // Heavy landing, a swell, then thinning as the brush runs out of ink.
      float landing = 0.35 * (1.0 - smoothstep(0.0, 0.05, t));
      float pressure = 0.75 + 0.35 * sin(3.14159 * min(t / 0.55, 1.0));
      float runOut = 1.0 - 0.45 * smoothstep(0.35, 0.95, t);
      float halfWidth = uRadius * 0.11 * (pressure * runOut + landing);
      halfWidth *= mix(0.3, 1.0, 1.0 - smoothstep(drawn - 0.07, drawn + 0.005, t));

      // Fibrous, bleeding edge where the ink soaks into the paper.
      float bleed = (fbm(p * 28.0 + 3.0) - 0.5) * 0.5;
      float across = (r - ringRadius) / halfWidth;
      float body = 1.0 - smoothstep(0.7, 1.0, abs(across) + bleed);

      // Kasure: dry-brush streaks that open up as the ink runs out.
      float bristles = 0.6 * noise(vec2(across * 7.0, t * 3.0))
        + 0.4 * noise(vec2(across * 19.0, t * 9.0 + 4.0));
      float dryness = mix(0.08, 0.72, smoothstep(0.3, 0.95, t));
      float kasure = smoothstep(dryness - 0.1, dryness + 0.1, bristles);

      // Wet ink is never flat: it pools toward the edges of the stroke and keeps
      // a faint trace of the bristles even where the brush is loaded.
      float mottle = 0.85 + 0.15 * fbm(p * 9.0);
      float pooling = 0.25 * smoothstep(0.35, 0.85, abs(across));
      float grain = 0.78 + 0.22 * bristles;
      float density = (mix(1.0, 0.72, t) + landing * 0.4 + pooling) * grain * mottle;
      float head = 1.0 - smoothstep(drawn - 0.015, drawn, t);
      float tail = smoothstep(0.0, 0.01, t);
      float stroke = clamp(body * kasure * density, 0.0, 1.0) * head * tail;

      // Where the brush first touches the paper it leaves a soaked, lopsided
      // blot, visible before any scrolling happens; ink gathers at its rim.
      float startRadius = uRadius * (1.0 + (noise(vec2(0.0, 1.7)) - 0.5) * 0.06);
      vec2 startPoint = center + vec2(cos(START_ANGLE), sin(START_ANGLE)) * startRadius;
      vec2 fromStart = p - startPoint;
      float blotRadius = uRadius * 0.12 * (0.8 + 0.4 * noise(normalize(fromStart + 1e-5) * 1.8 + 7.0));
      float blotDist = length(fromStart) / blotRadius + bleed;
      float blot = (1.0 - smoothstep(0.75, 1.0, blotDist)) * (0.8 + 0.25 * smoothstep(0.45, 0.95, blotDist));
      enso = max(stroke, blot * 0.95 * mottle) * uInkStrength;

      // Kintsugi: once the circle is nearly closed, a crack across the stroke is
      // revealed, mended in gold.
      float crackAngle = CRACK_ANGLE
        + (noise(vec2(r * 35.0, 2.3)) - 0.5) * 0.1
        + (noise(vec2(r * 140.0, 7.1)) - 0.5) * 0.03;
      float crack = 1.0 - smoothstep(0.0012, 0.0035, abs(angle - crackAngle) * r);
      float crackSpan = 1.0 - smoothstep(0.8, 1.1, abs(across));
      float reveal = smoothstep(0.84, 1.0, progress);
      gold = crack * crackSpan * reveal;
    }

    float inkAlpha = 1.0 - (1.0 - wash) * (1.0 - enso);
    vec3 color = mix(uPaper, uInk, inkAlpha);
    float shimmer = 0.85 + 0.15 * sin(uTime * 0.9 + r * 80.0);
    color = mix(color, uGold * shimmer, gold * 0.9);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export type InkSceneHandle = {
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

type CreateInkSceneOptions = {
  canvas: HTMLCanvasElement;
  isMobile: boolean;
  reduceMotion: boolean;
  isDark: boolean;
};

export function createInkScene({
  canvas,
  isMobile,
  reduceMotion,
  isDark,
}: CreateInkSceneOptions): InkSceneHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: "low-power",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const layout = isMobile ? ENSO_LAYOUT.mobile : ENSO_LAYOUT.desktop;
  const strength = isDark ? INK_STRENGTH.dark : INK_STRENGTH.light;

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: reduceMotion ? 1 : scrollProgress.value },
    uAspect: { value: 1 },
    uCenter: { value: new THREE.Vector2() },
    uRadius: { value: 0.3 },
    uPaper: { value: resolveCssColor("--background", "#f3efe6") },
    uInk: { value: resolveCssColor("--foreground", "#2b2621") },
    uGold: { value: resolveCssColor("--kintsugi", "#c9a24a") },
    uInkStrength: { value: strength.enso },
    uWashStrength: { value: strength.wash },
  };

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    defines: { OCTAVES: isMobile ? 4 : 5 },
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(geometry, material));

  const render = () => renderer.render(scene, camera);

  let rafId = 0;
  let disposed = false;
  let lastFrame = performance.now();
  let lastActivity = lastFrame;

  const renderFrame = (now: number) => {
    if (disposed) return;
    rafId = requestAnimationFrame(renderFrame);

    const progress = scrollProgress.value;
    const scrolled = Math.abs(progress - uniforms.uProgress.value) > 0.0005;
    if (scrolled) lastActivity = now;
    if (now - lastActivity > SETTLE_AFTER_MS) return;

    const elapsed = now - lastFrame;
    if (elapsed < (scrolled ? SCROLL_FRAME_MS : IDLE_FRAME_MS)) return;

    // Scene time only advances while rendering, so the ink resumes where it
    // settled instead of jumping ahead.
    uniforms.uTime.value += Math.min(elapsed, 100) / 1000;
    uniforms.uProgress.value = progress;
    lastFrame = now;
    render();
  };

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    const budget = Math.sqrt(MAX_BUFFER_PIXELS / (width * height));
    renderer.setPixelRatio(Math.min(dpr, budget));
    renderer.setSize(width, height, false);

    const aspect = width / height;
    uniforms.uAspect.value = aspect;
    uniforms.uRadius.value = Math.min(0.3, 0.4 * aspect);
    uniforms.uCenter.value.set(layout.x * aspect * 0.5, layout.y);

    render();
  };

  resize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);

  // With reduced motion the finished ensō is shown as a still image, redrawn
  // only on resize.
  if (!reduceMotion) rafId = requestAnimationFrame(renderFrame);

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };

  return { resize, dispose };
}
