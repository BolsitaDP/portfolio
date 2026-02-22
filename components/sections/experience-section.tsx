"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { ExperienceItem } from "@/lib/portfolio-data";

type ExperienceSectionProps = {
  experience: ExperienceItem[];
};

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="experience" className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t("experience.title")}
      </h2>
      <div className="space-y-4">
        {experience.map((item) => (
          <Card key={`${item.period.en}-${item.role.en}`} className="rounded-xl">
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-lg">{item.role[language]}</CardTitle>
                <Badge variant="outline">{item.period[language]}</Badge>
              </div>
              <CardDescription>
                {item.company} · {item.location[language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                {item.highlights.map((highlight) => (
                  <li key={highlight.en} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 rounded-full bg-primary"
                    />
                    <span>{highlight[language]}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
