"use client";

import { SectionHeading } from "@/components/sections/section-heading";
import { useI18n } from "@/lib/i18n";
import type { ExperienceItem } from "@/lib/portfolio-data";

type ExperienceSectionProps = {
  experience: ExperienceItem[];
};

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="experience" className="py-20 md:py-28">
      <SectionHeading index={5} title={t("experience.title")} />

      <ol className="border-t border-border/80">
        {experience.map((item) => (
          <li
            key={`${item.period.en}-${item.role.en}`}
            className="ink-reveal grid gap-3 border-b border-border/80 py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10"
          >
            <p className="font-mono text-xs tracking-wide text-muted-foreground md:pt-2">
              {item.period[ language ]}
            </p>
            <div>
              <h3 className="text-xl md:text-2xl">{item.role[ language ]}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.company} · {item.location[ language ]}
              </p>
              <ul className="mt-5 max-w-2xl space-y-2.5 text-sm leading-6 text-foreground/80">
                {item.highlights.map((highlight) => (
                  <li key={highlight.en} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7rem] h-px w-3 shrink-0 bg-muted-foreground/60"
                    />
                    <span>{highlight[ language ]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
