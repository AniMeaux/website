import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

const AVATAR_COLORS = ["blue", "gray", "green", "red", "yellow"] as const;
type AvatarColor = typeof AVATAR_COLORS[number];
type AvatarSize = "sm" | "lg" | "xl";

export type AvatarProps = {
  icon?: IconProps["id"];
  letter?: string;
  color?: AvatarColor;
  size?: AvatarSize;
};

export function Avatar({
  icon,
  letter,
  color = "gray",
  size = "sm",
}: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        {
          "rounded-0.5 w-2 h-2": size === "sm",
          "rounded-0.5 w-4 h-4": size === "lg",
          "rounded-1 w-8 h-8": size === "xl",
        },
        {
          "bg-blue-100 text-blue-600": color === "blue",
          "bg-gray-200 text-gray-700": color === "gray",
          "bg-green-100 text-green-700": color === "green",
          "bg-yellow-100 text-yellow-600": color === "yellow",
          "bg-red-100 text-red-600": color === "red",
        }
      )}
    >
      {icon != null ? (
        <Icon
          id={icon}
          className={cn({
            "text-[10px]": size === "sm",
            "text-[20px]": size === "lg",
            "text-[40px]": size === "xl",
          })}
        />
      ) : (
        <span
          className={cn("font-semibold leading-none", {
            "text-[12px]": size === "sm",
            "text-[20px]": size === "lg",
            "text-[40px]": size === "xl",
          })}
        >
          {letter}
        </span>
      )}
    </span>
  );
}

export function inferAvatarColor(uuid: string): AvatarColor {
  // We take the first 8 hexa characters.
  const hash = Number(`0x${uuid.substring(0, 8)}`);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
