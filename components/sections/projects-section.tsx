"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t, language } = useI18n();

  return (
    <section id="projects" className="py-20 md:py-28">
      <SectionHeading index={2} title={t("projects.title")} />

      {/* Two columns, the second set lower, so the grid never reads as a grid. */}
      <ul className="grid gap-16 md:grid-cols-2 md:gap-x-12 md:gap-y-20">
        {projects.map((project, index) => (
          <li
            key={project.title.en}
            className={cn("ink-reveal group relative", index % 2 === 1 && "md:mt-24")}
          >
            <Dialog>
              {/* Screenshots rest slightly faded and regain their color on hover. */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border/80 bg-muted">
                <Image
                  src={withBasePath(project.imageSrc)}
                  alt={project.imageAlt[ language ]}
                  fill
                  className="object-cover object-top grayscale-60 sepia-20 transition duration-1000 ease-brush group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:sepia-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="mt-5 flex gap-5">
                <span className="pt-2 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl">
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-ring"
                      >
                        {project.title[ language ]}
                      </button>
                    </DialogTrigger>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.description[ language ]}
                  </p>
                  <p className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground">
                    {project.stack.join(" · ")}
                  </p>
                  <span
                    aria-hidden="true"
                    className="ink-link mt-4 inline-block text-sm"
                  >
                    {t("projects.viewDetails")}
                  </span>
                </div>
              </div>

              <DialogContent className="max-h-[90vh] max-w-4xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-0 sm:max-w-4xl">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg border-b border-border/60 bg-muted/30">
                  <Image
                    src={withBasePath(project.imageSrc)}
                    alt={project.imageAlt[ language ]}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                </div>

                <div className="min-h-0 space-y-6 overflow-y-auto p-6 pr-14">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl">
                      {project.title[ language ]}
                    </DialogTitle>
                    <DialogDescription className="leading-6">
                      {project.description[ language ]}
                    </DialogDescription>
                  </DialogHeader>

                  <p className="text-sm leading-6 text-foreground/90">
                    {project.details[ language ]}
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">{t("projects.techStack")}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">{t("projects.keyPoints")}</p>
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {project.highlights.map((point) => (
                        <li key={point.en} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-[0.7rem] h-px w-3 shrink-0 bg-muted-foreground/60"
                          />
                          <span>{point[ language ]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(project.liveUrl || project.repoUrl) && (
                    <div className="flex flex-wrap gap-3">
                      {project.liveUrl ? (
                        <Button asChild>
                          <a href={project.liveUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" />
                            {t("projects.liveDemo")}
                          </a>
                        </Button>
                      ) : null}
                      {project.repoUrl ? (
                        <Button asChild variant="outline">
                          <a href={project.repoUrl} target="_blank" rel="noreferrer">
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
          </li>
        ))}
      </ul>
    </section>
  );
}
