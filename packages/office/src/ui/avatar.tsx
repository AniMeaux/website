import cn from "classnames";
import * as React from "react";

type AvatarColor = "default" | "blue";

const AvatarClassName: {
  [key in AvatarColor]: string;
} = {
  blue: "bg-blue-100 text-blue-500",
  default: "bg-gray-100 text-gray-700",
};

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  color?: AvatarColor;
};

export function Avatar({ color = "default", className, ...rest }: AvatarProps) {
  return (
    <span
      {...rest}
      className={cn(
        "rounded-full w-10 h-10 text-xl font-medium flex items-center justify-center",
        AvatarClassName[color],
        className
      )}
    />
  );
}
