"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();

  // Icons swap through the `dark` class rather than `resolvedTheme`, which is
  // unknown during server rendering and would cause a hydration mismatch.
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={t("nav.themeToggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="cursor-pointer text-muted-foreground hover:text-foreground"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
