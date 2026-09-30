"use client";

import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";

export function HomeSection() {
  const { language } = useI18n();

  return (
    <section
      id="home"
      className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/85 p-8 md:p-12"
    >

      <h1 className="relative mt-4 text-3xl font-medium md:text-5xl">
        {profile.name}
      </h1>
      <p className="relative mt-3 max-w-2xl text-muted-foreground">
        {profile.title[ language ]} · {profile.location[ language ]}
      </p>
    </section>
  );
}
