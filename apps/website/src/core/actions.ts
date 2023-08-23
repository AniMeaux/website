import { cn } from "#core/classNames.ts";

type ActionColor = "blue" | "yellow" | "gray";

const STANDALONE_ACTION_COLOR_CLASS_NAME: Record<ActionColor, string> = {
  blue: "bg-brandBlue text-white hover:bg-brandBlue-lighter",
  yellow: "bg-brandYellow text-black hover:bg-brandYellow-darker",
  gray: "bg-gray-100 hover:bg-gray-200",
};

export const actionClassNames = {
  standalone: ({ color = "blue" }: { color?: ActionColor } = {}) =>
    cn(
      "min-w-max flex-none px-6 py-2 rounded-bubble-sm flex items-center justify-center text-body-emphasis transition-[background-color,transform] duration-100 ease-in-out active:scale-95",
      STANDALONE_ACTION_COLOR_CLASS_NAME[color]
    ),
  proseInline: () =>
    "border-b text-body-emphasis border-b-brandBlue hover:border-b-2",
};
