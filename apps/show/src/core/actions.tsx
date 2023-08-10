import { forwardRef } from "react";
import { cn } from "~/core/classNames";
import { Primitive } from "~/core/primitives";

type ActionColor = "alabaster" | "mystic" | "prussianBlue";

export const Action = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button> & {
    color?: ActionColor;
  }
>(function Action({ className, color = "mystic", ...rest }, ref) {
  return (
    <Primitive.button
      {...rest}
      ref={ref}
      className={cn(
        "flex-none rounded-0.5 px-2 py-0.5 flex text-body-lowercase-emphasis transition-[background-color,color,transform] duration-100 ease-in-out hover:scale-105 active:scale-95 hover:active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
        COLOR_CLASS_NAMES[color],
        className
      )}
    />
  );
});

const COLOR_CLASS_NAMES: Record<ActionColor, string> = {
  alabaster: "bg-alabaster text-prussianBlue focus-visible:ring-alabaster",
  mystic: "bg-mystic text-white focus-visible:ring-mystic",
  prussianBlue: "bg-prussianBlue text-white focus-visible:ring-prussianBlue",
};

export const ProseInlineAction = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button>
>(function ProseInlineAction({ className, ...rest }, ref) {
  return (
    <Primitive.button
      {...rest}
      ref={ref}
      className={cn(
        "relative rounded-0.5 text-body-lowercase-emphasis after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-mystic hover:after:border-b-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
        className
      )}
    />
  );
});
