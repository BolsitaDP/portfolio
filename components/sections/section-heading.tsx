import { BrushStroke } from "@/components/ui/brush-stroke";

type SectionHeadingProps = {
  index: number;
  title: string;
  description?: string;
};

export function SectionHeading({ index, title, description }: SectionHeadingProps) {
  return (
    <header className="ink-reveal mb-12 md:mb-16">
      <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground">
        {String(index).padStart(2, "0")}
      </p>
      <h2 className="mt-3 text-3xl md:text-4xl">{title}</h2>
      <BrushStroke variant={index} className="brush-draw mt-3 h-2.5 w-28 text-foreground/25" />
      {description ? (
        <p className="mt-5 max-w-md text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
