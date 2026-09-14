import * as THREE from "three";

// getComputedStyle can resolve modern CSS color functions (oklch, lab, …)
// into syntaxes THREE.Color.setStyle() doesn't parse. A 1x1 canvas uses the
// browser's own CSS color parser instead, so any valid color string works.
let sampler: CanvasRenderingContext2D | null = null;

function getSampler(): CanvasRenderingContext2D | null {
  if (sampler) return sampler;
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  sampler = canvas.getContext("2d", { willReadFrequently: true });
  return sampler;
}

export function resolveCssColor(varName: string, fallback: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallback);

  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.opacity = "0";
  probe.style.pointerEvents = "none";
  probe.style.color = `var(${varName})`;
  document.body.appendChild(probe);

  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);

  const ctx = getSampler();
  if (!ctx) return new THREE.Color(fallback);

  try {
    ctx.fillStyle = computed || fallback;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  } catch {
    return new THREE.Color(fallback);
  }
}
