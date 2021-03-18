import cn from "classnames";
import * as React from "react";

export type AvatarSize = "small" | "medium" | "large" | "display";

const AvatarSizeClassName: {
  [key in AvatarSize]: string;
} = {
  small: "w-8 h-8 text-lg",
  medium: "w-10 h-10 text-xl",
  large: "w-12 h-12 text-2xl",
  display: "w-28 h-28 text-7xl",
};

type AvatarColor = "blue" | "default";

const AvatarColorClassName: {
  [key in AvatarColor]: string;
} = {
  blue: "bg-blue-500 bg-opacity-5 text-blue-500",
  default: "bg-black bg-opacity-5 text-black text-opacity-70",
};

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: AvatarSize;
  color?: AvatarColor;
};

export function Avatar({
  color = "default",
  size = "medium",
  className,
  ...rest
}: AvatarProps) {
  return (
    <span
      {...rest}
      className={cn(
        "overflow-hidden rounded-full font-medium flex items-center justify-center",
        AvatarSizeClassName[size],
        AvatarColorClassName[color],
        className
      )}
    />
  );
}
