import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

const AVATAR_COLORS = ["blue", "gray", "green", "red", "yellow"] as const;
type AvatarColor = typeof AVATAR_COLORS[number];

export function Avatar({
  icon,
  letter,
  color = "gray",
  isLarge = false,
}: {
  icon?: IconProps["id"];
  letter?: string;
  color?: AvatarColor;
  isLarge?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full flex items-center justify-center",
        isLarge ? "w-4 h-4" : "w-2 h-2",
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
        <Icon id={icon} className={isLarge ? "text-[20px]" : "text-[10px]"} />
      ) : (
        <span
          className={cn(
            "font-semibold",
            isLarge
              ? "leading-[20px] text-[20px]"
              : "leading-[12px] text-[12px]"
          )}
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
