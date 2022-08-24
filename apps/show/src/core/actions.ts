import { cn } from "~/core/classNames";

export const actionClassNames = {
  standalone: ({ color = "blue" }: { color?: "blue" | "yellow" } = {}) =>
    cn(
      "px-6 py-2 rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg flex items-center text-body-emphasis transition-[background-color,transform] duration-100 ease-in-out active:scale-95",
      {
        "bg-blue-base text-white hover:bg-blue-light": color === "blue",
        "bg-yellow-base text-black hover:bg-yellow-darker": color === "yellow",
      }
    ),
  proseInline: () =>
    "border-b text-body-emphasis border-b-blue-base hover:border-b-2",
};
