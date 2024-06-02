import { Spinner } from "#core/loaders/spinner";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

type ActionVariant = "primary" | "secondary" | "text" | "translucid";

export type ActionColor =
  | "black"
  | "blue"
  | "gray"
  | "green"
  | "orange"
  | "red";

export type ActionProps = React.ComponentPropsWithoutRef<
  typeof Primitive.button
> & {
  color?: ActionColor;
  isIconOnly?: boolean;
  variant?: ActionVariant;
};

export const Action = Object.assign(
  forwardRef<React.ComponentRef<typeof Primitive.button>, ActionProps>(
    function Action(
      {
        className,
        color = "blue",
        isIconOnly = false,
        variant = "primary",
        ...rest
      },
      ref,
    ) {
      return (
        <Primitive.button
          {...rest}
          ref={ref}
          className={cn(
            "relative flex flex-none items-center justify-center gap-0.5 duration-100 ease-in-out active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
            VARIANT_CLASS_NAME[variant]({ isIconOnly }),
            COLOR_CLASS_NAMES[variant][color],
            className,
          )}
        />
      );
    },
  ),
  {
    Loader: function ActionLoader({ isLoading }: { isLoading: boolean }) {
      return (
        <span
          className={cn(
            "absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-[inherit] bg-inherit transition-opacity duration-100 ease-in-out",
            isLoading ? "opacity-100" : "opacity-0",
          )}
        >
          <Spinner className="text-[20px]" />
        </span>
      );
    },

    Icon: function ActionIcon({
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof Icon>) {
      return <Icon {...props} className={cn("text-[20px]", className)} />;
    },
  },
);

const VARIANT_CLASS_NAME: Record<
  ActionVariant,
  (args: { isIconOnly: boolean }) => string
> = {
  primary: ({ isIconOnly }) =>
    cn(
      "h-4 min-w-[40px] rounded-0.5 transition-[background-color,transform] text-body-emphasis",
      isIconOnly ? "px-1" : "px-2",
    ),
  secondary: ({ isIconOnly }) =>
    cn(
      "h-4 min-w-[40px] rounded-0.5 transition-[background-color,transform] text-body-emphasis",
      isIconOnly ? "px-1" : "px-2",
    ),
  text: () =>
    cn(
      "h-2 min-w-[20px] rounded-0.5 transition-[color,transform] text-body-emphasis",
    ),
  translucid: ({ isIconOnly }) =>
    cn(
      "h-4 min-w-[40px] rounded-0.5 bg-opacity-50 transition-[background-color,transform] text-body-emphasis hover:bg-opacity-70",
      isIconOnly ? "px-1" : "px-2",
    ),
};

const COLOR_CLASS_NAMES: Record<ActionVariant, Record<ActionColor, string>> = {
  primary: {
    black: "",
    blue: "bg-blue-500 text-white hover:bg-blue-400",
    gray: "",
    green: "",
    orange: "",
    red: "",
  },
  secondary: {
    black: "",
    blue: "bg-blue-50 text-blue-500 hover:bg-blue-100",
    gray: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    green: "",
    orange: "bg-orange-50 text-orange-500 hover:bg-orange-100",
    red: "bg-red-50 text-red-500 hover:bg-red-100",
  },
  text: {
    black: "",
    blue: "text-blue-500 hover:text-blue-600",
    gray: "text-gray-500 hover:text-gray-800",
    green: "text-green-600 hover:text-green-500",
    orange: "text-orange-500 hover:text-orange-600",
    red: "text-red-500 hover:text-red-600",
  },
  translucid: {
    black: "bg-gray-700 text-white",
    blue: "",
    gray: "",
    green: "",
    orange: "",
    red: "",
  },
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
        "relative text-body-emphasis after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-blue-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg hover:after:border-b-2",
        className,
      )}
    />
  );
});
