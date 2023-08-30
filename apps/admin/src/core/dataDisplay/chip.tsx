import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";

type ChipColor = "gray" | "orange" | "red";

export function Chip({
  color,
  icon,
  title,
  children,
  className,
}: {
  color: ChipColor;
  icon?: IconProps["id"];
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        className,
        "h-2 rounded-0.5 px-0.5 flex items-center justify-center text-caption-emphasis",
        COLOR_CLASS_NAME[color],
      )}
    >
      {icon != null ? <Icon id={icon} className="text-[14px]" /> : null}
      {children}
    </span>
  );
}

const COLOR_CLASS_NAME: Record<ChipColor, string> = {
  gray: "bg-gray-100",
  orange: "bg-orange-500 text-white",
  red: "bg-red-500 text-white",
};
