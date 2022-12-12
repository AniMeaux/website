import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

const AVATAR_COLORS = ["blue", "green", "red", "yellow"] as const;
export type AvatarColor = typeof AVATAR_COLORS[number];
export type AvatarSize = "sm" | "lg" | "xl";

export type AvatarProps = {
  icon?: IconProps["id"];
  letter?: string;
  color?: AvatarColor;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({
  icon,
  letter,
  color = "blue",
  size = "sm",
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        className,
        "inline-flex items-center justify-center",
        AVATAR_SIZE_CLASS_NAME[size],
        COLOR_CLASS_NAME[color]
      )}
    >
      {icon != null ? (
        <Icon id={icon} className={ICON_CLASS_NAME[size]} />
      ) : (
        <span
          className={cn("font-semibold leading-none", LETTER_CLASS_NAME[size])}
        >
          {letter}
        </span>
      )}
    </span>
  );
}

export const AVATAR_SIZE_CLASS_NAME: Record<AvatarSize, string> = {
  sm: "rounded-0.5 w-2 h-2",
  lg: "rounded-0.5 w-4 h-4",
  xl: "rounded-1 w-8 h-8",
};

const COLOR_CLASS_NAME: Record<AvatarColor, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

const ICON_CLASS_NAME: Record<AvatarSize, string> = {
  sm: "text-[12px]",
  lg: "text-[20px]",
  xl: "text-[40px]",
};

const LETTER_CLASS_NAME: Record<AvatarSize, string> = {
  sm: "text-[14px]",
  lg: "text-[22px]",
  xl: "text-[44px]",
};

export function inferAvatarColor(uuid: string): AvatarColor {
  // We take the first 8 hexa characters.
  const hash = Number(`0x${uuid.substring(0, 8)}`);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
