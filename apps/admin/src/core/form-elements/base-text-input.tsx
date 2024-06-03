import { fromBooleanAttribute } from "#core/attributes";
import { ensureArray } from "#core/collections";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { createElement, forwardRef } from "react";

type BaseTextInputVariant = "outlined" | "search" | "transparent";

export const BaseTextInput = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Primitive.input>,
    React.ComponentPropsWithoutRef<typeof Primitive.input> & {
      variant?: BaseTextInputVariant;
      leftAdornmentCount: number;
      rightAdornmentCount: number;
      hideFocusRing?: boolean;
    }
  >(function BaseTextInput(
    {
      variant = "outlined",
      leftAdornmentCount,
      rightAdornmentCount,
      hideFocusRing = false,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Primitive.input
        {...rest}
        ref={ref}
        className={cn(
          "min-h-[40px] w-full min-w-0 appearance-none rounded-0.5 py-1 text-left ring-1 ring-inset transition-colors duration-100 ease-in-out placeholder:text-gray-500 aria-[invalid=true]:ring-red-500 data-[invalid=true]:ring-red-500",
          hideFocusRing
            ? "focus-visible:outline-none"
            : "focus-visible:focus-compact-blue-400 aria-[invalid=true]:focus-visible:focus-compact-red-500 data-[invalid=true]:focus-visible:focus-compact-red-500",
          INPUT_VARIANT_CLASS_NAMES[variant],
          {
            "pl-1": leftAdornmentCount === 0,
            "pl-4": leftAdornmentCount === 1,
          },
          {
            "pr-1": rightAdornmentCount === 0,
            "pr-4": rightAdornmentCount === 1,
            "pr-7": rightAdornmentCount === 2,
          },
          className,
        )}
      />
    );
  }),
  {
    Root: forwardRef<
      React.ComponentRef<typeof Primitive.span>,
      React.ComponentPropsWithoutRef<typeof Primitive.span>
    >(function BaseTextInputRoot({ className, ...rest }, ref) {
      return (
        <Primitive.span
          {...rest}
          ref={ref}
          className={cn(
            "relative inline-flex",
            fromBooleanAttribute(rest["aria-disabled"])
              ? "opacity-60"
              : undefined,
            className,
          )}
        />
      );
    }),

    AdornmentContainer: forwardRef<
      React.ComponentRef<typeof Primitive.span>,
      Omit<
        React.ComponentPropsWithoutRef<typeof Primitive.span>,
        "children"
      > & {
        side: "left" | "right";
        adornment: React.ReactNode | React.ReactNode[];
      }
    >(function BaseTextInputAdornmentContainer(
      { side, adornment, className, ...rest },
      ref,
    ) {
      const adornments = ensureArray(adornment);
      if (adornments.length === 0) {
        return null;
      }

      // Use `createElement` instead of JSX so we can spread `adornments` as
      // children without adding keys.
      return createElement(
        Primitive.span,
        {
          ...rest,
          ref,
          className: cn(
            "pointer-events-none absolute top-0 flex items-center p-0.5",
            side === "left" ? "left-0" : "right-0",
            className,
          ),
        },
        ...adornments,
      );
    }),

    Adornment: forwardRef<
      React.ComponentRef<typeof Primitive.span>,
      React.ComponentPropsWithoutRef<typeof Primitive.span>
    >(function BaseTextInputAdornment({ className, ...rest }, ref) {
      return (
        <Primitive.span
          {...rest}
          ref={ref}
          className={cn(
            "flex h-3 w-3 flex-none items-center justify-center text-[20px] text-gray-600",
            className,
          )}
        />
      );
    }),

    ActionAdornment: forwardRef<
      React.ComponentRef<"button">,
      React.ComponentPropsWithoutRef<"button">
    >(function BaseTextInputActionAdornment({ className, ...rest }, ref) {
      return (
        <BaseTextInput.Adornment asChild>
          <button
            {...rest}
            ref={ref}
            type="button"
            className={cn(
              "pointer-events-auto cursor-pointer rounded-full transition-colors duration-100 ease-in-out focus-visible:focus-compact-blue-400 hover:bg-gray-100",
              className,
            )}
          />
        </BaseTextInput.Adornment>
      );
    }),
  },
);

const INPUT_VARIANT_CLASS_NAMES: Record<BaseTextInputVariant, string> = {
  outlined: "ring-gray-200 bg-transparent",
  search: "ring-gray-100 bg-gray-100",
  transparent: "ring-transparent bg-transparent",
};
