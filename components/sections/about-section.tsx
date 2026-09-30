"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/sections/section-heading";
import { withBasePath } from "@/lib/base-path";
import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";

function splitLead(text: string) {
  const end = text.indexOf(". ");
  if (end === -1) return { lead: text, rest: "" };
  return { lead: text.slice(0, end + 1), rest: text.slice(end + 2) };
}

export function AboutSection() {
  const { t, language } = useI18n();
  const { lead, rest } = splitLead(profile.summary[ language ]);

  return (
    <section id="about" className="py-20 md:py-28">
      <SectionHeading index={1} title={t("about.title")} />

      <div className="grid gap-14 md:grid-cols-[minmax(0,1fr)_14rem] md:items-start lg:gap-24">
        <div className="ink-reveal max-w-2xl">
          <p className="font-serif text-2xl leading-snug md:text-3xl">{lead}</p>
          {rest ? (
            <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg">
              {rest}
            </p>
          ) : null}
        </div>

        <figure className="ink-reveal mx-auto w-52 rotate-[1.5deg] rounded-sm border border-border/80 bg-card p-3 md:mx-0 md:mt-20 md:w-56">
          <div className="relative aspect-square">
            <Image
              src={withBasePath("/profile/hotdog.png")}
              alt="Santiago Giraldo"
              fill
              className="object-contain drop-shadow-[4px_6px_6px_rgba(40,30,20,0.35)]"
              style={{
                maskImage: "linear-gradient(black 65%, transparent)",
                WebkitMaskImage: "linear-gradient(black 65%, transparent)",
              }}
              sizes="224px"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
