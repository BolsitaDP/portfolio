"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useTheme } from "next-themes";
import { createInkScene } from "@/components/three/ink-scene";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { scrollProgress } from "@/lib/three/scroll-progress";
import { isWebglAvailable } from "@/lib/three/webgl-support";

function noWebglSubscription() {
  return () => {};
}

function getWebglServerSnapshot() {
  return false;
}

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const webglOk = useSyncExternalStore(
    noWebglSubscription,
    isWebglAvailable,
    getWebglServerSnapshot,
  );

  // The scene reads its colors from CSS tokens, so it is rebuilt whenever the
  // theme flips between washi (light) and sumi (dark).
  useEffect(() => {
    if (!webglOk) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = createInkScene({ canvas, isMobile, reduceMotion, isDark });

    const handleResize = () => scene.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
    };
  }, [webglOk, isMobile, reduceMotion, isDark]);

  useEffect(() => {
    if (!webglOk) return;

    gsap.registerPlugin(ScrollTrigger);
    scrollProgress.value = 0;

    const tween = gsap.to(scrollProgress, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: () =>
          Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [webglOk]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {webglOk ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      ) : null}
      <div className="paper-grain absolute inset-0" />
    </div>
  );
}
