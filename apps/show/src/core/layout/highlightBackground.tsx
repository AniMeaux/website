import { cn } from "~/core/classNames";

type HighLightColor = "alabaster" | "paleBlue";

export function HighLightBackground({
  className,
  color,
}: {
  className?: string;
  color: HighLightColor;
}) {
  return (
    <svg
      viewBox="0 0 1024 400"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible", className)}
    >
      <path d={COLOR_PATH[color]} className={COLOR_CLASS_NAME[color]} />
    </svg>
  );
}

const COLOR_CLASS_NAME: Record<HighLightColor, string> = {
  alabaster: "fill-alabaster",
  paleBlue: "fill-paleBlue",
};

const COLOR_PATH: Record<HighLightColor, string> = {
  alabaster: "M0 400V-20C300 -10 724 -10 1024 0V420C724 410 300 410 0 400Z",
  paleBlue: "M0 420V0C300 -10 724 -10 1024 -20V400C724 410 300 410 0 420Z",
};
