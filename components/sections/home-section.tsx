"use client";

import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";

export function HomeSection() {
  const { language } = useI18n();

  return (
    <section
      id="home"
      className="glass-panel relative overflow-hidden rounded-2xl bg-card/60 bg-gradient-to-br from-white/[0.07] to-transparent p-8 shadow-sm backdrop-blur-xl backdrop-saturate-150 md:p-12"
    >
      <span className="glass-ripple" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-accent/20 blur-3xl"
      />

      <h1 className="relative mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
        {profile.name}
      </h1>
      <p className="relative mt-3 max-w-2xl text-muted-foreground">
        {profile.title[ language ]} · {profile.location[ language ]}
      </p>
    </section>
  );
}
