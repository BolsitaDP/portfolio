"use client";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";
import { ArrowUpRight, Copy, Linkedin } from "lucide-react";
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
    <section id="contact" className="py-20 md:py-32">
      <SectionHeading
        index={6}
        title={t("contact.title")}
        description={t("contact.subtitle")}
      />

      <div className="ink-reveal space-y-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("contact.email")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="break-all font-serif text-2xl underline decoration-border decoration-1 underline-offset-8 transition-colors duration-500 hover:decoration-foreground md:text-4xl"
            >
              {profile.email}
            </a>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer text-muted-foreground"
              onClick={handleCopyEmail}
            >
              <Copy className="size-4" />
              {t("contact.copyEmail")}
            </Button>
          </div>
        </div>

        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
        >
          <Linkedin className="size-4" aria-hidden="true" />
          {t("contact.linkedin")}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
