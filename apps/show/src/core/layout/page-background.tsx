import { cn } from "@animeaux/core";

export function PageBackground({
  isExpanded = false,
}: {
  isExpanded?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 600"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute left-0 -z-just-above h-[200px] w-full transition-[height,top] duration-slow md:h-[600px]",
        isExpanded ? "top-0" : "-top-[100px] md:-top-[300px]",
      )}
    >
      <path
        d="m416.054 0s-11.36 215.864 293.817 284.823c329.459 74.448 252.317 359.147 730.129 309.374v-594.197z"
        className="fill-paleBlue"
      />
    </svg>
  );
}
