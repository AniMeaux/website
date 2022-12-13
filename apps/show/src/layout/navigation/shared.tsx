import { cn } from "#/core/classNames";

export const navLinkClassName = ({
  isActive = false,
}: {
  isActive?: boolean;
} = {}) =>
  cn("px-3 py-2 flex items-center justify-between gap-1", {
    "text-black": isActive,
    "text-gray-700 hover:text-black": !isActive,
  });

export function handleEscape(callback: () => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !event.isDefaultPrevented()) {
      event.preventDefault();
      callback();
    }
  };
}
