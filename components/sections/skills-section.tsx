"use client";

import { SectionHeading } from "@/components/sections/section-heading";
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
    <section id="skills" className="py-20 md:py-28">
      <SectionHeading index={3} title={t("nav.skills")} />

      <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div className="ink-reveal">
          <h3 className="text-xl">{t("skills.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("skills.subtitle")}</p>
          <ul className="mt-6 grid border-t border-border/80 sm:grid-cols-2 sm:gap-x-10">
            {skills.map((skill) => {
              const Icon = iconMap[ skill.iconName ];

              return (
                <li
                  key={skill.label.en}
                  className="flex items-center gap-3 border-b border-border/80 py-3.5 text-sm"
                >
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  {skill.label[ language ]}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ink-reveal lg:mt-16">
          <h3 className="text-xl">{t("skills.softTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("skills.softSubtitle")}</p>
          <dl className="mt-6 space-y-7">
            {softSkills.map((skill) => (
              <div key={skill.title.en}>
                <dt className="font-serif text-lg">{skill.title[ language ]}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                  {skill.description[ language ]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
