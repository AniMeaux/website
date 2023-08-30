import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { cn } from "@animeaux/core";
import type { Location } from "history";
import { forwardRef } from "react";

export type NavGroup = "act" | "adopt" | "discover" | "warn";

export const navLinkClassName = ({
  isActive = false,
}: {
  isActive?: boolean;
} = {}) =>
  cn("px-3 py-2 flex items-center justify-between gap-1", {
    "text-black": isActive,
    "text-gray-700 hover:text-black": !isActive,
  });

export type SubNavComponent = React.FC & {
  isActive(location: Location): boolean;
};

type SubNavItemColor = "blue" | "cyan" | "green" | "red" | "yellow";

const subNavItemBgColorClassName: Record<SubNavItemColor, string> = {
  blue: "bg-brandBlue-lightest",
  cyan: "bg-brandCyan-lightest",
  green: "bg-brandGreen-lightest",
  red: "bg-brandRed-lightest",
  yellow: "bg-brandYellow-lightest",
};

const subNavItemTextColorClassName: Record<SubNavItemColor, string> = {
  blue: "text-brandBlue",
  cyan: "text-brandCyan",
  green: "text-brandGreen",
  red: "text-brandRed",
  yellow: "text-brandYellow-darker",
};

export const SubNavItem = forwardRef<
  HTMLAnchorElement,
  {
    to: BaseLinkProps["to"];
    icon: IconProps["id"];
    children: string;
    isMultiline?: boolean;
    color: SubNavItemColor;
  }
>(function SubNavItem({ to, icon, children, color, isMultiline = false }, ref) {
  return (
    <BaseLink
      ref={ref}
      to={to}
      className={cn(
        "group bg-opacity-0 px-3 py-2 flex items-center hover:bg-opacity-100 rounded-bubble-sm transition-colors duration-100 ease-in-out",
        subNavItemBgColorClassName[color],
        {
          "flex-col gap-1": isMultiline,
          "gap-3": !isMultiline,
        },
      )}
    >
      <span
        className={cn(
          "rounded-bubble-sm flex transition-colors duration-100 ease-in-out",
          {
            "p-3 text-[32px]": isMultiline,
            "p-2 text-[20px]": !isMultiline,
          },
          subNavItemBgColorClassName[color],
          subNavItemTextColorClassName[color],
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
            subNavItemTextColorClassName[color],
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
