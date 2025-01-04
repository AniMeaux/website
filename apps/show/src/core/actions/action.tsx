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
          "relative flex flex-none rounded-0.5 px-2 py-0.5 transition-colors duration-normal text-body-lowercase-emphasis disabled:opacity-disabled",
          CLASS_NAMES_BY_COLOR[color],
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

export const ActionIcon = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button> & {
    color?: ActionColor;
  }
>(function ActionIcon({ className, color = "mystic", ...props }, ref) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "flex flex-none rounded-0.5 px-1 py-0.5 transition-colors duration-normal icon-24 disabled:opacity-disabled",
        CLASS_NAMES_BY_COLOR[color],
        className,
      )}
    />
  );
});

type ActionColor = "alabaster" | "mystic" | "prussianBlue";

const CLASS_NAMES_BY_COLOR: Record<ActionColor, string> = {
  alabaster: cn(
    "bg-alabaster text-prussianBlue active:enabled:bg-alabaster-300 can-hover:focus-visible:focus-spaced can-hover:hover:enabled:bg-alabaster-200 active:can-hover:hover:enabled:bg-alabaster-300",
  ),
  mystic: cn(
    "bg-mystic text-white active:enabled:bg-mystic-700 can-hover:focus-visible:focus-spaced can-hover:hover:enabled:bg-mystic-600 active:can-hover:hover:enabled:bg-mystic-700",
  ),
  prussianBlue: cn(
    "bg-prussianBlue text-white active:enabled:bg-prussianBlue-800 can-hover:focus-visible:focus-spaced can-hover:hover:enabled:bg-prussianBlue-900 active:can-hover:hover:enabled:bg-prussianBlue-800",
  ),
};
