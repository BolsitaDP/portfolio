"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlassButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function GlassButton({
  children,
  className,
  href,
  target,
  rel,
  onClick,
}: GlassButtonProps) {
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glass-mouse-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--glass-mouse-y", `${event.clientY - rect.top}px`);
  };

  const sharedClassName = cn(
    "glass-panel glass-button relative rounded-lg px-4 py-2 font-sans text-sm font-medium text-foreground",
    className,
  );

  const label = (
    <span className="relative z-[2] inline-flex items-center justify-center gap-2 whitespace-nowrap">
      {children}
    </span>
  );

  const ripple = <span className="glass-ripple" aria-hidden="true" />;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        className={sharedClassName}
      >
        {ripple}
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={sharedClassName}
    >
      {ripple}
      {label}
    </button>
  );
}
