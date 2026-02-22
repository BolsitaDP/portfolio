"use client";

import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";

export function HomeSection() {
  const { language } = useI18n();

  return (
    <section
      id="home"
      className="rounded-2xl border bg-gradient-to-br from-card to-muted/40 p-8 md:p-12"
    >
      <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
        {profile.name}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {profile.title[ language ]} · {profile.location[ language ]}
      </p>
    </section>
  );
}
