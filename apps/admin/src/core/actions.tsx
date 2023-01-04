import { cn } from "~/core/classNames";

type ActionVariant =
  | "floating"
  | "primary"
  | "secondary"
  | "text"
  | "translucid";
export type ActionColor = "amber" | "black" | "blue" | "gray" | "green" | "red";

export const actionClassName = {
  standalone: ({
    variant = "primary",
    color = "blue",
  }: { variant?: ActionVariant; color?: ActionColor } = {}) => {
    return cn(
      "flex-none flex items-center justify-center gap-0.5 text-body-emphasis duration-100 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
      VARIANT_CLASS_NAME[variant],
      COLOR_CLASS_NAMES[variant][color]
    );
  },
  proseInline: () =>
    "border-b border-b-blue-500 text-body-emphasis hover:border-b-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
};

const VARIANT_CLASS_NAME: Record<ActionVariant, string> = {
  floating:
    "shadow-xl rounded-full w-5 h-5 justify-center text-[20px] transition-[background-color,transform]",
  primary:
    "rounded-0.5 min-w-[40px] h-4 px-2 transition-[background-color,transform]",
  secondary:
    "rounded-0.5 min-w-[40px] h-4 px-2 transition-[background-color,transform]",
  text: "rounded-0.5 min-w-[20px] h-2 transition-[color,transform]",
  translucid:
    "rounded-0.5 min-w-[40px] h-4 bg-opacity-50 px-2 transition-[background-color,transform] hover:bg-opacity-70",
};

const COLOR_CLASS_NAMES: Record<ActionVariant, Record<ActionColor, string>> = {
  floating: {
    amber: "",
    black: "",
    blue: "bg-blue-500 text-white hover:bg-blue-400",
    gray: "",
    green: "",
    red: "",
  },
  primary: {
    amber: "",
    black: "",
    blue: "bg-blue-500 text-white hover:bg-blue-400",
    gray: "",
    green: "",
    red: "",
  },
  secondary: {
    amber: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    black: "",
    blue: "bg-blue-50 text-blue-500 hover:bg-blue-100",
    gray: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    green: "",
    red: "bg-red-50 text-red-500 hover:bg-red-100",
  },
  text: {
    amber: "text-amber-600 hover:text-amber-500",
    black: "",
    blue: "text-blue-500 hover:text-blue-600",
    gray: "text-gray-800 hover:text-gray-700",
    green: "text-green-600 hover:text-green-500",
    red: "text-red-500 hover:text-red-600",
  },
  translucid: {
    amber: "",
    black: "bg-gray-700 text-white",
    blue: "",
    gray: "",
    green: "",
    red: "",
  },
};
