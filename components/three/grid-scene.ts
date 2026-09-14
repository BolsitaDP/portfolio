import * as THREE from "three";
import { resolveCssColor } from "@/lib/three/resolve-css-color";
import { scrollProgress } from "@/lib/three/scroll-progress";

type LatticeDims = {
  x: number;
  y: number;
  z: number;
  spacing: number;
  jitter: number;
};

const LATTICE: Record<"desktop" | "mobile", LatticeDims> = {
  desktop: { x: 8, y: 6, z: 8, spacing: 2.1, jitter: 3.2 },
  mobile: { x: 5, y: 4, z: 5, spacing: 2.2, jitter: 2.6 },
};

function buildLattice(dims: LatticeDims) {
  const { x: nx, y: ny, z: nz, spacing, jitter } = dims;
  const pointCount = nx * ny * nz;
  const basePositions = new Float32Array(pointCount * 3);
  const jitterOffsets = new Float32Array(pointCount * 3);

  const index = (i: number, j: number, k: number) => i * ny * nz + j * nz + k;
  const direction = new THREE.Vector3();

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        const p = index(i, j, k);
        const i3 = p * 3;

        basePositions[i3] = (i - (nx - 1) / 2) * spacing;
        basePositions[i3 + 1] = (j - (ny - 1) / 2) * spacing;
        basePositions[i3 + 2] = (k - (nz - 1) / 2) * spacing;

        direction
          .set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
          .normalize();
        const magnitude = jitter * (0.4 + Math.random() * 0.6);
        jitterOffsets[i3] = direction.x * magnitude;
        jitterOffsets[i3 + 1] = direction.y * magnitude;
        jitterOffsets[i3 + 2] = direction.z * magnitude;
      }
    }
  }

  const edgesA: number[] = [];
  const edgesB: number[] = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        const a = index(i, j, k);
        if (i + 1 < nx) {
          edgesA.push(a);
          edgesB.push(index(i + 1, j, k));
        }
        if (j + 1 < ny) {
          edgesA.push(a);
          edgesB.push(index(i, j + 1, k));
        }
        if (k + 1 < nz) {
          edgesA.push(a);
          edgesB.push(index(i, j, k + 1));
        }
      }
    }
  }

  return {
    pointCount,
    basePositions,
    jitterOffsets,
    edgeIndexA: Int32Array.from(edgesA),
    edgeIndexB: Int32Array.from(edgesB),
  };
}

export type GridSceneHandle = {
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

type CreateGridSceneOptions = {
  canvas: HTMLCanvasElement;
  isMobile: boolean;
  reduceMotion: boolean;
};

export function createGridScene({
  canvas,
  isMobile,
  reduceMotion,
}: CreateGridSceneOptions): GridSceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  const cameraStart = isMobile ? 15 : 19;
  const cameraEnd = isMobile ? 7 : 8;
  camera.position.set(0, 0, cameraStart);

  const primaryColor = resolveCssColor("--primary", "#d4d4d8");
  const accentColor = resolveCssColor("--accent", "#8b8b93");
  const backgroundColor = resolveCssColor("--background", "#0a0a0a");
  const nodeColor = backgroundColor.clone().lerp(primaryColor, 0.3);

  scene.fog = new THREE.Fog(backgroundColor.getHex(), 8, isMobile ? 22 : 28);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  const pointLight = new THREE.PointLight(primaryColor, 40);
  pointLight.position.set(6, 6, 10);
  scene.add(ambientLight, pointLight);

  const group = new THREE.Group();
  scene.add(group);

  const lattice = buildLattice(isMobile ? LATTICE.mobile : LATTICE.desktop);
  const currentPositions = new Float32Array(lattice.basePositions.length);

  const nodeGeometry = new THREE.IcosahedronGeometry(0.12, 0);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: nodeColor,
    emissive: accentColor,
    emissiveIntensity: 0.8,
    roughness: 0.4,
    metalness: 0.15,
  });
  const mesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, lattice.pointCount);
  const dummy = new THREE.Object3D();
  const instanceColor = new THREE.Color();
  for (let p = 0; p < lattice.pointCount; p++) {
    instanceColor.copy(primaryColor).lerp(accentColor, Math.random());
    mesh.setColorAt(p, instanceColor);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  group.add(mesh);

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(lattice.edgeIndexA.length * 6);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.32,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lines);

  const startTime = performance.now();
  let rafId = 0;
  let disposed = false;

  const renderFrame = () => {
    if (disposed) return;
    rafId = requestAnimationFrame(renderFrame);

    const t = (performance.now() - startTime) / 1000;
    const progress = reduceMotion ? 0.45 : scrollProgress.value;
    const dispersion = THREE.MathUtils.clamp(1 - progress / 0.4, 0, 1);
    const travel = THREE.MathUtils.clamp((progress - 0.05) / 0.9, 0, 1);

    if (!reduceMotion) {
      group.rotation.y = t * 0.045;
      group.rotation.x = Math.sin(t * 0.08) * 0.05;
    }

    const { basePositions, jitterOffsets, edgeIndexA, edgeIndexB, pointCount } = lattice;

    for (let p = 0; p < pointCount; p++) {
      const i3 = p * 3;
      const x = basePositions[i3] + jitterOffsets[i3] * dispersion;
      const y = basePositions[i3 + 1] + jitterOffsets[i3 + 1] * dispersion;
      const z = basePositions[i3 + 2] + jitterOffsets[i3 + 2] * dispersion;

      currentPositions[i3] = x;
      currentPositions[i3 + 1] = y;
      currentPositions[i3 + 2] = z;

      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(p, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const linePositionArray = lineGeometry.attributes.position.array as Float32Array;
    for (let e = 0; e < edgeIndexA.length; e++) {
      const a = edgeIndexA[e] * 3;
      const b = edgeIndexB[e] * 3;
      const o = e * 6;
      linePositionArray[o] = currentPositions[a];
      linePositionArray[o + 1] = currentPositions[a + 1];
      linePositionArray[o + 2] = currentPositions[a + 2];
      linePositionArray[o + 3] = currentPositions[b];
      linePositionArray[o + 4] = currentPositions[b + 1];
      linePositionArray[o + 5] = currentPositions[b + 2];
    }
    lineGeometry.attributes.position.needsUpdate = true;

    camera.position.z = THREE.MathUtils.lerp(cameraStart, cameraEnd, travel);
    nodeMaterial.emissiveIntensity = 0.7 + Math.sin(t * 0.6) * 0.15;

    renderer.render(scene, camera);
  };

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  resize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);
  rafId = requestAnimationFrame(renderFrame);

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    nodeGeometry.dispose();
    nodeMaterial.dispose();
    lineGeometry.dispose();
    lineMaterial.dispose();
    renderer.dispose();
  };

  return { resize, dispose };
}
