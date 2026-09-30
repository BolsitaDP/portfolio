import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { profile } from "@/lib/portfolio-data";

// A quiet colophon: the page ends signed with the brush S, the way an ink
// painting is signed with a seal.
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-32 md:pb-14">
      <div className="flex items-end justify-between border-t border-border/60 pt-10">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <Image
          src={withBasePath("/brand/s-mark.webp")}
          alt=""
          width={100}
          height={96}
          className="h-8 w-auto opacity-75 dark:invert"
        />
      </div>
    </footer>
  );
}
