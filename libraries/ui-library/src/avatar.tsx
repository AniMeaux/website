import cn from "classnames";
import * as React from "react";

type AvatarSize = "xsmall" | "small" | "medium";

const AvatarSizeClassName: {
  [key in AvatarSize]: string;
} = {
  xsmall: "w-8 h-8 text-xl",
  small: "w-10 h-10 text-xl",
  medium: "w-12 h-12 text-2xl",
};

type AvatarColor = "default" | "blue";

const AvatarColorClassName: {
  [key in AvatarColor]: string;
} = {
  blue: "bg-blue-500 bg-opacity-5 text-blue-500",
  default: "bg-black bg-opacity-5 text-default-color text-opacity-90",
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
        "rounded-full font-medium flex items-center justify-center",
        AvatarSizeClassName[size],
        AvatarColorClassName[color],
        className
      )}
    />
  );
}
