import { cn } from "~/core/classNames";

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

export const actionClassName = {
  standalone: ({
    variant = "primary",
    color = "blue",
    isIconOnly = false,
  }: {
    variant?: ActionVariant;
    color?: ActionColor;
    isIconOnly?: boolean;
  } = {}) => {
    return cn(
      "flex-none flex items-center justify-center gap-0.5 text-body-emphasis duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      VARIANT_CLASS_NAME[variant]({ isIconOnly }),
      COLOR_CLASS_NAMES[variant][color]
    );
  },

  proseInline: () =>
    "relative text-body-emphasis after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-blue-500 hover:after:border-b-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
};

const VARIANT_CLASS_NAME: Record<
  ActionVariant,
  (args: { isIconOnly: boolean }) => string
> = {
  floating: () =>
    "shadow-xl rounded-full w-5 h-5 justify-center text-[20px] transition-[background-color,transform]",
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
