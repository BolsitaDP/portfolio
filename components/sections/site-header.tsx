"use client";

import { ThemeToggle } from "@/components/sections/theme-toggle";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { t, toggleLanguage } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-brush text-base leading-none text-foreground md:text-lg">
          Santiago Giraldo
        </span>

        <div className="flex items-center gap-3">
          <ul className="hidden gap-5 text-sm text-muted-foreground md:flex">
            <li>
              <a className="ink-link hover:text-foreground" href="#home">
                {t("nav.home")}
              </a>
            </li>
            <li>
              <a className="ink-link hover:text-foreground" href="#about">
                {t("nav.about")}
              </a>
            </li>
            <li>
              <a className="ink-link hover:text-foreground" href="#projects">
                {t("nav.projects")}
              </a>
            </li>
            <li>
              <a className="ink-link hover:text-foreground" href="#skills">
                {t("nav.skills")}
              </a>
            </li>
            <li>
              <a className="ink-link hover:text-foreground" href="#education">
                {t("nav.education")}
              </a>
            </li>
            <li>
              <a className="ink-link hover:text-foreground" href="#experience">
                {t("nav.experience")}
              </a>
            </li>
            <li>
              <a className="ink-link hover:text-foreground" href="#contact">
                {t("nav.contact")}
              </a>
            </li>
          </ul>

          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="min-w-14 cursor-pointer"
          >
            {t("nav.langButton")}
            <span className="sr-only">{t("nav.langLabel")}</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
