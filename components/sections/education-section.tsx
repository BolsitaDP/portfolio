"use client";

import { SectionHeading } from "@/components/sections/section-heading";
import { useI18n } from "@/lib/i18n";
import type { EducationItem } from "@/lib/portfolio-data";

type EducationSectionProps = {
  education: EducationItem[];
};

export function EducationSection({ education }: EducationSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="education" className="py-20 md:py-28">
      <SectionHeading index={4} title={t("education.title")} />

      <ol className="border-t border-border/80">
        {education.map((item) => (
          <li
            key={`${item.title.en}-${item.period.en}`}
            className="ink-reveal grid gap-3 border-b border-border/80 py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10"
          >
            <p className="font-mono text-xs tracking-wide text-muted-foreground md:pt-2">
              {item.period[ language ]}
            </p>
            <div>
              <h3 className="text-xl md:text-2xl">{item.title[ language ]}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.institution} · {item.location[ language ]}
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-foreground/80">
                {item.summary[ language ]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
