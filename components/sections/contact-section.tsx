"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";
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
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {t("contact.email")}
              </p>
              <p className="mt-1 truncate font-mono text-sm text-foreground">
                {profile.email}
              </p>
            </div>
            <Button type="button" className="cursor-pointer" variant="outline" onClick={handleCopyEmail}>
              {t("contact.copyEmail")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                {t("contact.linkedin")}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
