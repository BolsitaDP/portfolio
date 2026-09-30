"use client";

import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";

export function HomeSection() {
  const { t, language } = useI18n();
  const [ firstName, ...lastNames ] = profile.name.split(" ");

  // The name sits low and to the left, leaving the rest of the first screen
  // empty for the brush to land in.
  return (
    <section
      id="home"
      className="flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-28 pt-24 md:pb-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {profile.location[ language ]}
      </p>
      <h1 className="mt-6 text-6xl leading-[1.05] font-normal md:text-8xl">
        <span className="block">{firstName}</span>
        <span className="block pl-[0.6em]">{lastNames.join(" ")}</span>
      </h1>
      <p className="mt-8 max-w-md text-lg text-muted-foreground">
        {profile.title[ language ]}
      </p>
      <a
        href="#about"
        className="group mt-16 inline-flex w-fit items-center gap-3 text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
      >
        <span
          aria-hidden="true"
          className="h-px w-10 bg-current transition-[width] duration-700 ease-brush group-hover:w-16"
        />
        {t("home.scroll")}
      </a>
    </section>
  );
}
