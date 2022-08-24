import { forwardRef } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";

export const NavLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function NavLink({ className, ...rest }, ref) {
    return (
      <BaseLink
        {...rest}
        ref={ref}
        className={cn(
          className,
          "px-3 py-2 flex items-center justify-between gap-1 text-gray-700 hover:text-black"
        )}
      />
    );
  }
);

export function handleEscape(callback: () => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !event.isDefaultPrevented()) {
      event.preventDefault();
      callback();
    }
  };
}
