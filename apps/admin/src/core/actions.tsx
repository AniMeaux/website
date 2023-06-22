import { forwardRef } from "react";
import { cn } from "~/core/classNames";
import { Spinner } from "~/core/loaders/spinner";
import { Primitive } from "~/core/primitives";

type ActionVariant =
  | "floating"
  | "primary"
  | "secondary"
  | "text"
  | "translucid";

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
  forwardRef<HTMLButtonElement, ActionProps>(function Action(
    {
      className,
      color = "blue",
      isIconOnly = false,
      variant = "primary",
      ...rest
    },
    ref
  ) {
    return (
      <Primitive.button
        {...rest}
        ref={ref}
        className={cn(
          "relative flex-none flex items-center justify-center gap-0.5 text-body-emphasis duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          VARIANT_CLASS_NAME[variant]({ isIconOnly }),
          COLOR_CLASS_NAMES[variant][color],
          className
        )}
      />
    );
  }),
  {
    Loader: function ActionLoader({ isLoading }: { isLoading: boolean }) {
      return (
        <span
          className={cn(
            "absolute top-0 left-0 w-full h-full rounded-[inherit] bg-inherit flex items-center justify-center transition-opacity duration-100 ease-in-out",
            isLoading ? "opacity-100" : "opacity-0"
          )}
        >
          <Spinner />
        </span>
      );
    },
  }
);

export const ProseInlineAction = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Primitive.button>
>(function ProseInlineAction({ className, ...rest }, ref) {
  return (
    <Primitive.button
      {...rest}
      ref={ref}
      className={cn(
        "relative text-body-emphasis after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-blue-500 hover:after:border-b-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className
      )}
    />
  );
});

const VARIANT_CLASS_NAME: Record<
  ActionVariant,
  (args: { isIconOnly: boolean }) => string
> = {
  floating: () =>
    "shadow-ambient rounded-full w-5 h-5 justify-center text-[20px] transition-[background-color,transform]",
  primary: ({ isIconOnly }) =>
    cn(
      "rounded-0.5 min-w-[40px] h-4 transition-[background-color,transform]",
      isIconOnly ? "px-1" : "px-2"
    ),
  secondary: ({ isIconOnly }) =>
    cn(
      "rounded-0.5 min-w-[40px] h-4 transition-[background-color,transform]",
      isIconOnly ? "px-1" : "px-2"
    ),
  text: () => "rounded-0.5 min-w-[20px] h-2 transition-[color,transform]",
  translucid: ({ isIconOnly }) =>
    cn(
      "rounded-0.5 min-w-[40px] h-4 bg-opacity-50 transition-[background-color,transform] hover:bg-opacity-70",
      isIconOnly ? "px-1" : "px-2"
    ),
};

const COLOR_CLASS_NAMES: Record<ActionVariant, Record<ActionColor, string>> = {
  floating: {
    black: "",
    blue: "bg-blue-500 text-white hover:bg-blue-400",
    gray: "",
    green: "",
    orange: "",
    red: "",
  },
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
    gray: "text-gray-800 hover:text-gray-700",
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
