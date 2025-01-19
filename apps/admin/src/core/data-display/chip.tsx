import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";

export type ChipVariant = "primary" | "secondary";

export type ChipColor =
  | "black"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "yellow";

export function Chip({
  variant,
  color,
  icon,
  title,
  children,
  className,
}: {
  variant: ChipVariant;
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
        COLOR_CLASS_NAME[variant][color],
      )}
    >
      {icon != null ? <Icon href={icon} className="text-[14px]" /> : null}
      {children}
    </span>
  );
}

const COLOR_CLASS_NAME: Record<ChipVariant, Record<ChipColor, string>> = {
  primary: {
    black: cn("bg-gray-800 text-white"),
    blue: cn("bg-blue-500 text-white"),
    green: cn("bg-green-600 text-white"),
    orange: cn("bg-orange-500 text-white"),
    red: cn("bg-red-500 text-white"),
    yellow: cn("bg-yellow-400 text-gray-800"),
  },

  secondary: {
    black: cn("bg-gray-100 text-gray-800"),
    blue: cn("bg-blue-50 text-blue-500"),
    green: cn("bg-green-50 text-green-600"),
    orange: cn("bg-orange-50 text-orange-500"),
    red: cn("bg-red-50 text-red-500"),
    yellow: cn("bg-yellow-50 text-yellow-700"),
  },
};
