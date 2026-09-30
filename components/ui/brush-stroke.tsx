import { cn } from "@/lib/utils";

// Hand-shaped strokes: each one lands heavy and lifts off thin, and no two are
// alike, so repeated headings never look stamped.
const STROKES = [
  "M2 6.5C20 4.2 50 3.6 80 4.4C96 4.8 110 5.6 118 6.8C110 7.4 96 7.6 80 7.9C50 8.8 22 9.6 4 9.2C1.5 9.1 0.8 7 2 6.5Z",
  "M1 5C25 3.2 55 4.4 85 5.6C100 6.2 112 7.4 119 8.8C108 8.6 96 8.4 84 8.6C56 8.8 26 8.6 3 8.2C0.6 8 0 5.4 1 5Z",
  "M2 8C30 4 70 3 117 5.2C118.5 5.4 118.6 6.4 117 6.6C72 6.6 34 8 5 10.4C2.4 10.6 0.8 8.6 2 8Z",
];

type BrushStrokeProps = {
  variant?: number;
  className?: string;
};

export function BrushStroke({ variant = 0, className }: BrushStrokeProps) {
  return (
    <svg
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block", className)}
    >
      <path d={STROKES[variant % STROKES.length]} fill="currentColor" />
    </svg>
  );
}
