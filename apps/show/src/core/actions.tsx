import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

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
        "flex flex-none rounded-0.5 px-2 py-0.5 transition-[background-color,color,transform] duration-100 ease-in-out text-body-lowercase-emphasis active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg hover:scale-105 hover:active:scale-95",
        COLOR_CLASS_NAMES[color],
        className,
      )}
    />
  );
});

const COLOR_CLASS_NAMES: Record<ActionColor, string> = {
  alabaster: "bg-alabaster text-prussianBlue focus-visible:ring-mystic",
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
        "relative border-b border-mystic text-body-lowercase-emphasis focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg hover:border-b-2",
        className,
      )}
    />
  );
});
