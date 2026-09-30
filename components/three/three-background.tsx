"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { InkSceneHandle } from "@/components/three/ink-scene";
import { useIsDarkTheme } from "@/lib/hooks/use-is-dark-theme";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { scrollProgress } from "@/lib/three/scroll-progress";
import { isWebglAvailable } from "@/lib/three/webgl-support";
import { cn } from "@/lib/utils";

function noWebglSubscription() {
  return () => {};
}

function getWebglServerSnapshot() {
  return false;
}

// three.js and GSAP are loaded on demand rather than bundled with the page:
// the background is decoration, so the content hydrates without waiting for it.
export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ ready, setReady ] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = usePrefersReducedMotion();
  const isDark = useIsDarkTheme();
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

    let scene: InkSceneHandle | null = null;
    let cancelled = false;

    import("@/components/three/ink-scene").then(({ createInkScene }) => {
      if (cancelled) return;
      scene = createInkScene({ canvas, isMobile, reduceMotion, isDark });
      setReady(true);
    });

    const handleResize = () => scene?.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      scene?.dispose();
    };
  }, [ webglOk, isMobile, reduceMotion, isDark ]);

  useEffect(() => {
    if (!webglOk) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    Promise.all([ import("gsap"), import("gsap/dist/ScrollTrigger") ]).then(
      ([ { gsap }, { ScrollTrigger } ]) => {
        if (cancelled) return;

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

        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [ webglOk ]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {webglOk ? (
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-1000 ease-brush",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
      <div className="paper-grain absolute inset-0" />
    </div>
  );
}
