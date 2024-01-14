import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";
import type { Merge } from "type-fest";

export type AvatarSize = "sm" | "lg" | "xl";

export type AvatarColor =
  | "blue"
  | "blue-light"
  | "gray"
  | "gray-light"
  | "green"
  | "green-light"
  | "red"
  | "red-light"
  | "yellow"
  | "yellow-light";

export const Avatar = forwardRef<
  React.ComponentRef<typeof Primitive.span>,
  Merge<
    React.ComponentPropsWithoutRef<typeof Primitive.span>,
    {
      color?: AvatarColor;
      size: AvatarSize;
    }
  >
>(function Avatar({ color, size, className, ...props }, ref) {
  return (
    <Primitive.span
      {...props}
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold leading-none",
        CLASS_NAME_BY_SIZE[size],
        color != null ? CLASS_NAME_BY_COLOR[color] : undefined,
        className,
      )}
    />
  );
});

const CLASS_NAME_BY_SIZE: Record<AvatarSize, string> = {
  sm: cn("rounded-0.5 w-2 h-2 text-[14px]"),
  lg: cn("rounded-0.5 w-4 h-4 text-[28px]"),
  xl: cn("rounded-1 w-8 h-8 text-[56px]"),
};

const CLASS_NAME_BY_COLOR: Record<AvatarColor, string> = {
  blue: cn("bg-blue-600 text-white"),
  "blue-light": cn("bg-blue-100 text-blue-600"),
  gray: cn("bg-gray-800 text-white"),
  "gray-light": cn("bg-gray-100 text-gray-800"),
  green: cn("bg-green-600 text-white"),
  "green-light": cn("bg-green-100 text-green-600"),
  red: cn("bg-red-500 text-white"),
  "red-light": cn("bg-red-100 text-red-500"),
  yellow: cn("bg-yellow-600 text-white"),
  "yellow-light": cn("bg-yellow-100 text-yellow-600"),
};
