import cn from "classnames";
import * as React from "react";

type AvatarColor = "default" | "blue";

const AvatarClassName: {
  [key in AvatarColor]: string;
} = {
  blue: "bg-blue-500 bg-opacity-5 text-blue-500",
  default: "bg-black bg-opacity-5 text-default-color text-opacity-90",
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
