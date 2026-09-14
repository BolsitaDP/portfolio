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
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm transition-all duration-300 hover:border-primary/40 hover:bg-muted/50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="font-medium">{skill.label[language]}</span>
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
            <div
              key={skill.title.en}
              className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-primary"
                />
                <p className="text-sm font-medium">{skill.title[language]}</p>
              </div>
              <p className="mt-1 pl-3.5 text-sm text-muted-foreground">
                {skill.description[language]}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
