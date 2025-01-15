import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";

export type ChipVariant = "filled" | "outlined";

export type ChipColor =
  | "black"
  | "blue"
  | "gray"
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
        "inline-flex h-2 items-center justify-center rounded-0.5 px-0.5",
        VARIANT_CLASS_NAME[variant],
        COLOR_CLASS_NAME[variant][color],
      )}
    >
      {icon != null ? <Icon href={icon} className="text-[14px]" /> : null}
      {children}
    </span>
  );
}

const VARIANT_CLASS_NAME: Record<ChipVariant, string> = {
  filled: cn("text-caption-emphasis"),
  outlined: cn("border text-caption-default"),
};

const COLOR_CLASS_NAME: Record<ChipVariant, Record<ChipColor, string>> = {
  filled: {
    black: cn("bg-gray-800 text-white"),
    blue: cn("bg-blue-500 text-white"),
    gray: cn("bg-gray-100"),
    green: cn("bg-green-600 text-white"),
    orange: cn("bg-orange-500 text-white"),
    red: cn("bg-red-500 text-white"),
    yellow: cn("bg-yellow-400 text-black"),
  },

  outlined: {
    black: cn("border-gray-800"),
    blue: cn("border-blue-500"),
    gray: cn("border-gray-200"),
    green: cn("border-green-600"),
    orange: cn("border-orange-500"),
    red: cn("border-red-500"),
    yellow: cn("border-yellow-400"),
  },
};
