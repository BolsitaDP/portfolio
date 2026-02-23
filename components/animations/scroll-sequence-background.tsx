"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { APP_BASE_PATH } from "@/lib/base-path";

const SEQUENCES = {
  desktop: {
    basePath: `${APP_BASE_PATH}/animations/desktop`,
    frameCount: 120,
  },
  mobile: {
    basePath: `${APP_BASE_PATH}/animations/mobile`,
    frameCount: 120,
  },
} as const;

function frameSrc(basePath: string, index: number) {
  return `${basePath}/${String(index + 1).padStart(4, "0")}.webp`;
}

export function ScrollSequenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let tween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;
    let cleanupImages: (() => void) | null = null;

    const frameState = { frame: 0 };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const setupSequence = (isMobile: boolean) => {
      tween?.kill();
      trigger?.kill();
      cleanupImages?.();

      const sequence = isMobile ? SEQUENCES.mobile : SEQUENCES.desktop;
      const images = Array.from({ length: sequence.frameCount }, (_, index) => {
        const image = new Image();
        image.decoding = "async";
        image.src = frameSrc(sequence.basePath, index);
        return image;
      });

      const drawFrame = () => {
        const targetIndex = Math.round(frameState.frame);
        const image = images[ targetIndex ];

        if (!image || !image.complete || image.naturalWidth === 0) return;

        const viewportWidth = canvas.clientWidth;
        const viewportHeight = canvas.clientHeight;

        context.clearRect(0, 0, viewportWidth, viewportHeight);

        const scale = Math.max(
          viewportWidth / image.naturalWidth,
          viewportHeight / image.naturalHeight,
        );

        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        const x = (viewportWidth - drawWidth) / 2;
        const y = (viewportHeight - drawHeight) / 2;

        context.drawImage(image, x, y, drawWidth, drawHeight);
      };

      const handleResize = () => {
        resizeCanvas();
        drawFrame();
      };

      window.addEventListener("resize", handleResize);

      images.forEach((image, index) => {
        image.onload = () => {
          if (index === 0 || index === Math.round(frameState.frame)) {
            drawFrame();
          }
        };
      });

      frameState.frame = 0;
      drawFrame();

      tween = gsap.to(frameState, {
        frame: sequence.frameCount - 1,
        duration: 1,
        ease: "none",
        snap: "frame",
        onUpdate: drawFrame,
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: () =>
            Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      trigger = tween.scrollTrigger ?? null;
      ScrollTrigger.refresh();

      cleanupImages = () => {
        window.removeEventListener("resize", handleResize);
        images.forEach((image) => {
          image.onload = null;
          image.onerror = null;
        });
      };
    };

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setupSequence(event.matches);
    };

    setupSequence(mediaQuery.matches);

    const mediaListener = (event: MediaQueryListEvent) => onMediaChange(event);
    mediaQuery.addEventListener("change", mediaListener);

    return () => {
      mediaQuery.removeEventListener("change", mediaListener);
      tween?.kill();
      trigger?.kill();
      cleanupImages?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full scale-110 opacity-55 blur-[1px] saturate-125 contrast-110 will-change-transform md:opacity-100"
      />
      <div className="absolute inset-0 bg-background/58" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--primary)_0%,transparent_45%),radial-gradient(circle_at_80%_30%,var(--accent)_0%,transparent_40%)] opacity-15" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)] opacity-10" />
    </div>
  );
}
