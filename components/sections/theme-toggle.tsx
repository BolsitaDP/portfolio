"use client";

import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // The new theme spreads from the button like ink, out to the farthest
    // corner of the viewport.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Color transitions would fade inside the growing circle, so they are
    // paused while it spreads, as next-themes does on its own changes.
    const root = document.documentElement;
    const freeze = document.createElement("style");
    freeze.textContent = "*,*::before,*::after{transition:none!important}";

    const transition = document.startViewTransition(() => {
      document.head.appendChild(freeze);
      // next-themes applies the class in an effect, too late for the new
      // snapshot, so set it here; its effect then applies the same class.
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
      setTheme(next);
    });

    // `ready` rejects when a quick second click skips this transition; the
    // theme still changes, only the spreading circle is lost.
    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: getComputedStyle(root).getPropertyValue("--brush-curve").trim() || "ease-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }).catch(() => {});

    // Never leave transitions frozen, even if the transition never settles.
    const unfreeze = () => freeze.remove();
    transition.finished.finally(unfreeze);
    window.setTimeout(unfreeze, 1500);
  };

  // Icons swap through the `dark` class rather than `resolvedTheme`, which is
  // unknown during server rendering and would cause a hydration mismatch.
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={t("nav.themeToggle")}
      onClick={handleClick}
      className="cursor-pointer text-muted-foreground hover:text-foreground"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
