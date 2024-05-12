import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

type Color = "gray";

export const BlockItem = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div> & {
      color: Color;
    }
  >(function BlockItemRoot({ color, className, ...props }, ref) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1 items-center justify-items-center gap-0.5 rounded-0.5 p-1",
          COLOR_CLASS_NAME[color],
          className,
        )}
      />
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Icon>,
    React.ComponentPropsWithoutRef<typeof Icon>
  >(function BlockItemIcon({ className, ...props }, ref) {
    return <Icon {...props} ref={ref} className={cn("icon-30", className)} />;
  }),

  Label: forwardRef<
    React.ComponentRef<typeof Primitive.p>,
    React.ComponentPropsWithoutRef<typeof Primitive.p>
  >(function BlockItemLabel({ className, ...props }, ref) {
    return (
      <Primitive.p
        {...props}
        ref={ref}
        className={cn("text-body-emphasis", className)}
      />
    );
  }),
};

const COLOR_CLASS_NAME: Record<Color, string> = {
  gray: cn("bg-gray-100 text-gray-700"),
};
