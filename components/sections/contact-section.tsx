"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";
import { ArrowUpRight, Check, Copy, Linkedin } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const { t } = useI18n();
  const [ copied, setCopied ] = useState(false);

  // Success is confirmed quietly on the button itself; only failures raise a toast.
  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [ copied ]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
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
              className="ink-link break-all font-serif text-2xl md:text-4xl"
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
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? t("contact.copiedEmail") : t("contact.copyEmail")}
            </Button>
            <span role="status" className="sr-only">
              {copied ? t("contact.copySuccessToast") : ""}
            </span>
          </div>
        </div>

        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="ink-link inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
        >
          <Linkedin className="size-4" aria-hidden="true" />
          {t("contact.linkedin")}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
