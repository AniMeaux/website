import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";

export type ChipColor =
  | "black"
  | "blue"
  | "gray"
  | "green"
  | "orange"
  | "red"
  | "yellow";

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
        "inline-flex h-2 items-center justify-center rounded-0.5 px-0.5 text-caption-emphasis",
        COLOR_CLASS_NAME[color],
      )}
    >
      {icon != null ? <Icon href={icon} className="text-[14px]" /> : null}
      {children}
    </span>
  );
}

const COLOR_CLASS_NAME: Record<ChipColor, string> = {
  black: cn("bg-gray-800 text-white"),
  blue: cn("bg-blue-500 text-white"),
  gray: cn("bg-gray-100"),
  green: cn("bg-green-600 text-white"),
  orange: cn("bg-orange-500 text-white"),
  red: cn("bg-red-500 text-white"),
  yellow: cn("bg-yellow-400 text-black"),
};
