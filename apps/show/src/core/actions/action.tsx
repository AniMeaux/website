import { Spinner } from "#core/loaders/spinner";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const Action = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Primitive.button>,
    React.ComponentPropsWithoutRef<typeof Primitive.button> & {
      color?: ActionColor;
    }
  >(function Action({ className, color = "mystic", ...props }, ref) {
    return (
      <Primitive.button
        {...props}
        ref={ref}
        className={cn(
          "relative flex flex-none rounded-0.5 px-2 py-0.5 transition-colors duration-normal text-body-lowercase-emphasis",
          COLOR_CLASS_NAMES[color],
          className,
        )}
      />
    );
  }),
  {
    Loader: function ActionLoader({ isLoading }: { isLoading: boolean }) {
      return (
        <span
          className={cn(
            "absolute inset-0 grid grid-cols-1 items-center justify-items-center rounded-[inherit] bg-[inherit] transition-opacity duration-normal",
            isLoading ? "opacity-100" : "opacity-0",
          )}
        >
          <Spinner />
        </span>
      );
    },
  },
);

type ActionColor = "alabaster" | "mystic" | "prussianBlue";

const COLOR_CLASS_NAMES: Record<ActionColor, string> = {
  alabaster: cn(
    "bg-alabaster text-prussianBlue active:bg-alabaster-300 can-hover:hover:bg-alabaster-200 can-hover:focus-visible:focus-spaced active:can-hover:hover:bg-alabaster-300",
  ),
  mystic: cn(
    "bg-mystic text-white active:bg-mystic-700 can-hover:hover:bg-mystic-600 can-hover:focus-visible:focus-spaced active:can-hover:hover:bg-mystic-700",
  ),
  prussianBlue: cn(
    "bg-prussianBlue text-white active:bg-prussianBlue-800 can-hover:hover:bg-prussianBlue-900 can-hover:focus-visible:focus-spaced active:can-hover:hover:bg-prussianBlue-800",
  ),
};
