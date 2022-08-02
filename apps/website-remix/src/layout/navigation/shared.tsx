import { forwardRef } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export type NavGroup = "act" | "adopt" | "discover" | "warn";

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

type SubNavItemColor = "blue" | "cyan" | "green" | "red" | "yellow";

const subNavItemBgColorClassName: Record<SubNavItemColor, string> = {
  blue: "bg-blue-base",
  cyan: "bg-cyan-base",
  green: "bg-green-base",
  red: "bg-red-base",
  yellow: "bg-yellow-base",
};

const subNavItemTextColorClassName: Record<SubNavItemColor, string> = {
  blue: "text-blue-base",
  cyan: "text-cyan-base",
  green: "text-green-base",
  red: "text-red-base",
  yellow: "text-yellow-darker",
};

export const SubNavItem = forwardRef<
  HTMLAnchorElement,
  BaseLinkProps & {
    icon: IconProps["id"];
    children: string;
    isMultiline?: boolean;
    color: SubNavItemColor;
  }
>(function SubNavItem(
  { icon, children, color, isMultiline = false, className, ...rest },
  ref
) {
  return (
    <BaseLink
      ref={ref}
      {...rest}
      className={cn(
        className,
        "group bg-opacity-0 px-3 py-2 flex items-center hover:bg-opacity-10 rounded-tl-2xl rounded-tr-xl rounded-br-2xl rounded-bl-xl transition-colors duration-100 ease-in-out",
        subNavItemBgColorClassName[color],
        {
          "flex-col gap-1": isMultiline,
          "gap-3": !isMultiline,
        }
      )}
    >
      <span
        className={cn(
          "rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-opacity-5 flex group-hover:bg-opacity-0 transition-colors duration-100 ease-in-out",
          {
            "p-3 text-[32px]": isMultiline,
            "p-2 text-[20px]": !isMultiline,
          },
          subNavItemBgColorClassName[color],
          subNavItemTextColorClassName[color]
        )}
      >
        <Icon id={icon} />
      </span>

      <span className="flex-1 min-w-0">{children}</span>

      {!isMultiline && (
        <Icon
          id="arrowRight"
          className={cn(
            "opacity-0 text-[20px] group-hover:opacity-100 transition-opacity duration-100 ease-in-out",
            subNavItemTextColorClassName[color]
          )}
        />
      )}
    </BaseLink>
  );
});

export function handleEscape(callback: () => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !event.isDefaultPrevented()) {
      event.preventDefault();
      callback();
    }
  };
}
