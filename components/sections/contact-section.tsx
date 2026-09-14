"use client";

import { GlassButton } from "@/components/ui/glass-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";
import { Copy, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const { t } = useI18n();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success(t("contact.copySuccessToast"));
    } catch {
      toast.error(t("contact.copyErrorToast"));
    }
  };

  return (
    <section id="contact">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">
            {t("contact.title")}
          </CardTitle>
          <CardDescription>{t("contact.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 transition-all duration-300 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t("contact.email")}
                </p>
                <p className="mt-1 truncate font-mono text-sm text-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
            <GlassButton onClick={handleCopyEmail}>
              <Copy className="size-4" />
              {t("contact.copyEmail")}
            </GlassButton>
          </div>

          <div className="flex flex-wrap gap-3">
            <GlassButton href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin className="size-4" />
              {t("contact.linkedin")}
            </GlassButton>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
