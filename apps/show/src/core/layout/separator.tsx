import { cn } from "@animeaux/core";

type SeparatorColor = "alabaster" | "mystic" | "prussianBlue";

export function VerticalSeparator({ color }: { color: SeparatorColor }) {
  return (
    <svg
      viewBox="0 0 3 100"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "h-full w-[3px] overflow-visible",
        COLOR_CLASS_NAMES[color],
      )}
    >
      <path
        d="M1.5 0L1.5 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 13"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HorizontalSeparator({
  color,
  className,
}: {
  color: SeparatorColor;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 3"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "h-[3px] w-full overflow-visible",
        COLOR_CLASS_NAMES[color],
        className,
      )}
    >
      <path
        d="M0 1.5L100 1.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 13"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const COLOR_CLASS_NAMES: Record<SeparatorColor, string> = {
  alabaster: cn("text-alabaster"),
  mystic: cn("text-mystic"),
  prussianBlue: cn("text-prussianBlue"),
};
