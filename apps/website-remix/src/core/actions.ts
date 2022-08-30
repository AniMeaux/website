import { cn } from "~/core/classNames";

type ActionColor = "blue" | "yellow" | "gray";

const STANDALONE_ACTION_COLOR_CLASS_NAME: Record<ActionColor, string> = {
  blue: "bg-blue-base text-white hover:bg-blue-light",
  yellow: "bg-yellow-base text-black hover:bg-yellow-darker",
  gray: "bg-gray-100 hover:bg-gray-200",
};

export const actionClassNames = {
  standalone: ({ color = "blue" }: { color?: ActionColor } = {}) =>
    cn(
      "px-6 py-2 rounded-bubble-sm flex items-center text-body-emphasis transition-[background-color,transform] duration-100 ease-in-out active:scale-95",
      STANDALONE_ACTION_COLOR_CLASS_NAME[color]
    ),
  proseInline: () =>
    "border-b text-body-emphasis border-b-blue-base hover:border-b-2",
};
