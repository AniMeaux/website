import { cn } from "@animeaux/core"

type ActionColor = "blue" | "yellow" | "gray"

const STANDALONE_ACTION_COLOR_CLASS_NAME: Record<ActionColor, string> = {
  blue: cn("bg-brand-blue text-white hover:bg-brand-blue-lighter"),
  yellow: cn("bg-brand-yellow text-black hover:bg-brand-yellow-darker"),
  gray: cn("bg-gray-100 hover:bg-gray-200"),
}

export const actionClassNames = {
  standalone: ({ color = "blue" }: { color?: ActionColor } = {}) =>
    cn(
      "flex min-w-max flex-none items-center justify-center rounded-bubble-sm px-6 py-2 text-body-emphasis transition-[background-color,scale] active:scale-95",
      STANDALONE_ACTION_COLOR_CLASS_NAME[color],
    ),
  proseInline: () =>
    cn("border-b border-b-brand-blue text-body-emphasis hover:border-b-2"),
}
