"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { Skill, SoftSkill } from "@/lib/portfolio-data";
import {
  Atom,
  Braces,
  Figma,
  Github,
  GitBranch,
  Globe,
  Server,
  Smartphone,
  SwatchBook,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type SkillsSectionProps = {
  skills: Skill[];
  softSkills: SoftSkill[];
};

const iconMap: Record<Skill["iconName"], LucideIcon> = {
  braces: Braces,
  atom: Atom,
  smartphone: Smartphone,
  swatchbook: SwatchBook,
  workflow: Workflow,
  "git-branch": GitBranch,
  globe: Globe,
  figma: Figma,
  github: Github,
  server: Server,
};

export function SkillsSection({ skills, softSkills }: SkillsSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="skills" className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">
            {t("skills.title")}
          </CardTitle>
          <CardDescription>{t("skills.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {skills.map((skill) => {
            const Icon = iconMap[skill.iconName];

            return (
              <div
                key={skill.label.en}
                className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3 text-sm"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <span>{skill.label[language]}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card id="soft-skills" className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">
            {t("skills.softTitle")}
          </CardTitle>
          <CardDescription>{t("skills.softSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {softSkills.map((skill) => (
            <div key={skill.title.en} className="rounded-xl border bg-muted/40 p-4">
              <p className="text-sm font-medium">{skill.title[language]}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {skill.description[language]}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
