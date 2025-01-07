import { Spinner } from "#core/loaders/spinner";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const Action = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Primitive.button>,
    React.ComponentPropsWithoutRef<typeof Primitive.button> & {
      variant?: Variant;
      color?: Color;
    }
  >(function Action(
    { variant = "button", color = "mystic", className, ...props },
    ref,
  ) {
    return (
      <Primitive.button
        {...props}
        ref={ref}
        className={cn(
          "relative flex flex-none rounded-0.5 px-2 py-0.5 transition-colors duration-normal text-body-lowercase-emphasis disabled:opacity-disabled can-hover:focus-visible:focus-spaced",
          CLASS_NAMES_BY_COLOR[variant][color],
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
    variant?: Variant;
    color?: Color;
  }
>(function ActionIcon(
  { variant = "button", color = "mystic", className, ...props },
  ref,
) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "flex flex-none rounded-0.5 px-1 py-0.5 transition-colors duration-normal icon-24 disabled:opacity-disabled can-hover:focus-visible:focus-spaced",
        CLASS_NAMES_BY_COLOR[variant][color],
        className,
      )}
    />
  );
});

type Variant = "button" | "link";
type Color = "alabaster" | "mystic" | "prussianBlue";

// `enabled` doesn't work on `<a/>`.
// To avoid having `<a/>` styles applied to `<button/>`, we use `is-link`.
const CLASS_NAMES_BY_COLOR: Record<Variant, Record<Color, string>> = {
  button: {
    alabaster: cn(
      "bg-alabaster text-prussianBlue",

      // <button/>
      "active:enabled:bg-alabaster-300 can-hover:hover:enabled:bg-alabaster-200 active:can-hover:hover:enabled:bg-alabaster-300",

      // <a/>
      "is-link:active:bg-alabaster-300 is-link:can-hover:hover:bg-alabaster-200 is-link:active:can-hover:hover:bg-alabaster-300",
    ),

    mystic: cn(
      "bg-mystic text-white",

      // <button/>
      "active:enabled:bg-mystic-700 can-hover:hover:enabled:bg-mystic-600 active:can-hover:hover:enabled:bg-mystic-700",

      // <a/>
      "is-link:active:bg-mystic-700 is-link:can-hover:hover:bg-mystic-600 is-link:active:can-hover:hover:bg-mystic-700",
    ),

    prussianBlue: cn(
      "bg-prussianBlue text-white",

      // <button/>
      "active:enabled:bg-prussianBlue-800 can-hover:hover:enabled:bg-prussianBlue-900 active:can-hover:hover:enabled:bg-prussianBlue-800",

      // <a/>
      "is-link:active:bg-prussianBlue-800 is-link:can-hover:hover:bg-prussianBlue-900 is-link:active:can-hover:hover:bg-prussianBlue-800",
    ),
  },

  link: {
    alabaster: cn(
      "bg-transparent text-prussianBlue",

      // <button/>
      "active:enabled:bg-alabaster-200 can-hover:hover:enabled:bg-alabaster active:can-hover:hover:enabled:bg-alabaster-200",

      // <a/>
      "is-link:active:bg-alabaster-200 is-link:can-hover:hover:bg-alabaster is-link:active:can-hover:hover:bg-alabaster-200",
    ),

    mystic: cn(
      "bg-transparent text-mystic",

      // <button/>
      "active:enabled:bg-mystic-100 can-hover:hover:enabled:bg-mystic-50 active:can-hover:hover:enabled:bg-mystic-100",

      // <a/>
      "is-link:active:bg-mystic-100 is-link:can-hover:hover:bg-mystic-50 is-link:active:can-hover:hover:bg-mystic-100",
    ),

    prussianBlue: cn(
      "bg-transparent text-prussianBlue",

      // <button/>
      "active:enabled:bg-prussianBlue-100 can-hover:hover:enabled:bg-prussianBlue-50 active:can-hover:hover:enabled:bg-prussianBlue-100",

      // <a/>
      "is-link:active:bg-prussianBlue-100 is-link:can-hover:hover:bg-prussianBlue-50 is-link:active:can-hover:hover:bg-prussianBlue-100",
    ),
  },
};
