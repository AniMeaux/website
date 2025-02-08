import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const InputActiveFilter = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.label>,
    React.ComponentPropsWithoutRef<typeof Primitive.label>
  >(function InputActiveFilterRoot({ className, ...props }, ref) {
    return (
      <Primitive.label
        {...props}
        ref={ref}
        className={cn(
          "group/selector relative flex cursor-pointer items-start gap-1 rounded-0.5 px-1 py-0.5",
          className,
        )}
      />
    );
  }),

  Input: forwardRef<
    React.ComponentRef<"input">,
    Except<React.ComponentPropsWithoutRef<"input">, "defaultChecked" | "type">
  >(function InputActiveFilterInput({ className, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        type="checkbox"
        defaultChecked
        className={cn(
          "peer/input absolute inset-0 -z-just-above h-full w-full cursor-pointer appearance-none rounded-0.5 transition-colors duration-normal",

          // Background.
          "bg-mystic active:bg-mystic-700 can-hover:hover:bg-mystic-600 active:can-hover:hover:bg-mystic-700",

          // Border.
          "border border-mystic",

          // Focus outline.
          "can-hover:focus-visible:focus-spaced",

          className,
        )}
      />
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function InputActiveFilterIcon({ className, ...props }, ref) {
    return (
      <>
        <Primitive.span
          {...props}
          ref={ref}
          className={cn(
            "flex-none text-white icon-24 can-hover:group-hover/selector:hidden",
            className,
          )}
        />

        <Icon
          id="x-mark-light"
          className="hidden flex-none text-white icon-24 can-hover:group-hover/selector:block"
        />
      </>
    );
  }),

  Label: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function InputActiveFilterLabel({ className, ...props }, ref) {
    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn(
          "min-w-0 text-white text-body-lowercase-emphasis",
          className,
        )}
      />
    );
  }),

  RemoveIcon: function InputActiveFilterRemoveIcon() {
    return (
      <Icon id="x-mark-light" className="text-white icon-24 can-hover:hidden" />
    );
  },
};
