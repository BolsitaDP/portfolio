"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { t, toggleLanguage } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <span
          className="text-base leading-none text-foreground md:text-lg"
          style={{ fontFamily: "var(--font-yuji-boku)" }}
        >
          Santiago Giraldo
        </span>

        <div className="flex items-center gap-3">
          <ul className="hidden gap-5 text-sm text-muted-foreground md:flex">
            <li>
              <a className="hover:text-foreground" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href="#about">
                {t("nav.about")}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href="#projects">
                {t("nav.projects")}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href="#skills">
                {t("nav.skills")}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href="#education">
                {t("nav.education")}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href="#experience">
                {t("nav.experience")}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href="#contact">
                {t("nav.contact")}
              </a>
            </li>
          </ul>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="min-w-14 cursor-pointer"
          >
            {t("nav.langButton")}
          </Button>
        </div>
      </nav>
    </header>
  );
}
