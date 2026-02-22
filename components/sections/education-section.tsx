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
import type { EducationItem } from "@/lib/portfolio-data";

type EducationSectionProps = {
  education: EducationItem[];
};

export function EducationSection({ education }: EducationSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="education" className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t("education.title")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {education.map((item) => (
          <Card key={`${item.title.en}-${item.period.en}`} className="rounded-xl">
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <CardTitle className="text-lg leading-6">
                  {item.title[language]}
                </CardTitle>
                <Badge variant="outline">{item.period[language]}</Badge>
              </div>
              <CardDescription>
                {item.institution} · {item.location[language]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.summary[language]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
