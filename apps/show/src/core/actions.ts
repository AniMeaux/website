import { cn } from "~/core/classNames";

type ActionColor = "blue" | "yellow" | "gray";

const STANDALONE_ACTION_COLOR_CLASS_NAME: Record<ActionColor, string> = {
  blue: "bg-brandBlue text-white",
  yellow: "bg-brandYellow text-black",
  gray: "bg-gray-100",
};

const STANDALONE_ACTION_HOVER_COLOR_CLASS_NAME: Record<ActionColor, string> = {
  blue: "hover:bg-brandBlue-lighter",
  yellow: "hover:bg-brandYellow-darker",
  gray: "hover:bg-gray-200",
};

export const actionClassNames = {
  standalone: ({
    color = "blue",
    disabled = false,
  }: { color?: ActionColor; disabled?: boolean } = {}) =>
    cn(
      "min-w-max flex-none px-6 py-2 rounded-bubble-sm flex items-center text-body-emphasis transition-[background-color,transform] duration-100 ease-in-out active:scale-95",
      STANDALONE_ACTION_COLOR_CLASS_NAME[color],
      disabled ? "opacity-50" : STANDALONE_ACTION_HOVER_COLOR_CLASS_NAME[color]
    ),
  proseInline: () =>
    "border-b text-body-emphasis border-b-brandBlue hover:border-b-2",
};
