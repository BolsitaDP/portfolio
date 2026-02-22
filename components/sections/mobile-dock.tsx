"use client";

import { useI18n } from "@/lib/i18n";
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

const items = [
  { href: "#home", key: "home", icon: Home },
  { href: "#about", key: "about", icon: User },
  { href: "#projects", key: "projects", icon: FolderKanban },
  { href: "#skills", key: "skills", icon: Sparkles },
  { href: "#education", key: "education", icon: GraduationCap },
  { href: "#experience", key: "experience", icon: Briefcase },
  { href: "#contact", key: "contact", icon: Mail },
] as const;

export function MobileDock() {
  const { t } = useI18n();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
      <nav
        aria-label="Mobile navigation"
        className="pointer-events-auto mx-auto w-full max-w-lg rounded-[1.35rem] border border-white/12 bg-background/55 p-1.5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        <ul className="grid grid-cols-7 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const label = item.key === "home" ? "Home" : t(`nav.${item.key}`);

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground active:scale-[0.98]"
                >
                  <Icon className="size-4 transition-transform group-active:scale-95" />
                  <span className="truncate leading-none">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

