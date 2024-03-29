import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
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
  icon?: IconName;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        className,
        "flex h-2 items-center justify-center rounded-0.5 px-0.5 text-caption-emphasis",
        COLOR_CLASS_NAME[color],
      )}
    >
      {icon != null ? <Icon href={icon} className="text-[14px]" /> : null}
      {children}
    </span>
  );
}

const COLOR_CLASS_NAME: Record<ChipColor, string> = {
  gray: "bg-gray-100",
  orange: "bg-orange-500 text-white",
  red: "bg-red-500 text-white",
};
