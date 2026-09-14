"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { createGridScene } from "@/components/three/grid-scene";
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
  const webglOk = useSyncExternalStore(
    noWebglSubscription,
    isWebglAvailable,
    getWebglServerSnapshot,
  );

  useEffect(() => {
    if (!webglOk) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = createGridScene({ canvas, isMobile, reduceMotion });

    const handleResize = () => scene.resize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
    };
  }, [webglOk, isMobile, reduceMotion]);

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
        scrub: 0.35,
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
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-80 md:opacity-100"
        />
      ) : null}
      <div className="absolute inset-0 bg-background/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0%,transparent_45%),radial-gradient(circle_at_80%_30%,var(--accent)_0%,transparent_40%)] opacity-15" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)] opacity-25" />
    </div>
  );
}
