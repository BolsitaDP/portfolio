"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { withBasePath } from "@/lib/base-path";
import { useI18n } from "@/lib/i18n";
import { profile } from "@/lib/portfolio-data";

export function AboutSection() {
  const { t, language } = useI18n();

  return (
    <section id="about">
      <Card className="rounded-2xl">
        <div className="grid gap-6 md:grid-cols-[1.25fr_0.75fr] md:items-stretch">
          <div>
            <CardHeader>
              <CardTitle className="text-2xl tracking-tight">
                {t("about.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="max-w-3xl leading-7 text-muted-foreground">
                {profile.summary[ language ]}
              </p>
            </CardContent>
          </div>

          <div className="grid min-h-[220px] place-items-center px-6 pb-6 md:min-h-full md:py-6">
            <div className="relative aspect-square w-full max-w-52 md:max-w-60">
              <Image
                src={withBasePath("/profile/hotdog.png")}
                alt="Santiago Giraldo"
                fill
                className="object-contain drop-shadow-[5px_5px_5px_rgba(0,0,0,0.75)]"
                style={{
                  maskImage: "linear-gradient(black 65%, transparent)",
                  WebkitMaskImage: "linear-gradient(black 65%, transparent)",
                }}
                sizes="(max-width: 768px) 208px, 240px"
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
