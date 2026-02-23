"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { withBasePath } from "@/lib/base-path";
import { useI18n } from "@/lib/i18n";
import type { Project } from "@/lib/portfolio-data";
import { ExternalLink, Github } from "lucide-react";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="projects" className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("projects.title")}
        </h2>
        <Badge variant="secondary">{t("projects.featured")}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Dialog key={project.title.en}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer rounded-xl transition-transform duration-200 hover:-translate-y-1">
                <div className="px-6 pt-6">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border/60 bg-muted/30">
                    <Image
                      src={withBasePath(project.imageSrc)}
                      alt={project.imageAlt[language]}
                      fill
                      className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="gap-3">
                  <CardTitle className="text-lg">
                    {project.title[language]}
                  </CardTitle>
                  <CardDescription className="leading-6">
                    {project.description[language]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech}>
                        <Badge variant="outline">{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-medium text-primary">
                    {t("projects.viewDetails")}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] max-w-4xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-0 sm:max-w-4xl">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg border-b border-border/60 bg-muted/30">
                <Image
                  src={withBasePath(project.imageSrc)}
                  alt={project.imageAlt[language]}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>

              <div className="min-h-0 space-y-6 overflow-y-auto p-6 pr-14">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl tracking-tight">
                    {project.title[language]}
                  </DialogTitle>
                  <DialogDescription className="leading-6">
                    {project.description[language]}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground/90">
                    {project.details[language]}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">{t("projects.techStack")}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">{t("projects.keyPoints")}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {project.highlights.map((point) => (
                      <li key={point.en} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 rounded-full bg-primary"
                        />
                        <span>{point[language]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {(project.liveUrl || project.repoUrl) && (
                  <div className="flex flex-wrap gap-3">
                    {project.liveUrl ? (
                      <Button asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="size-4" />
                          {t("projects.liveDemo")}
                        </a>
                      </Button>
                    ) : null}
                    {project.repoUrl ? (
                      <Button asChild variant="outline">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Github className="size-4" />
                          {t("projects.repository")}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
