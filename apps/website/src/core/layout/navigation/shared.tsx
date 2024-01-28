import type { BaseLinkProps } from "#core/baseLink";
import { BaseLink } from "#core/baseLink";
import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import type { Location } from "history";
import { forwardRef } from "react";

export type NavGroup = "act" | "adopt" | "discover" | "warn";

export const navLinkClassName = ({
  isActive = false,
}: {
  isActive?: boolean;
} = {}) =>
  cn("flex items-center justify-between gap-1 px-3 py-2", {
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
        "group flex items-center bg-opacity-0 px-3 py-2 transition-colors duration-100 ease-in-out rounded-bubble-sm hover:bg-opacity-100",
        subNavItemBgColorClassName[color],
        {
          "flex-col gap-1": isMultiline,
          "gap-3": !isMultiline,
        },
      )}
    >
      <span
        className={cn(
          "flex transition-colors duration-100 ease-in-out rounded-bubble-sm",
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

      <span className="min-w-0 flex-1">{children}</span>

      {!isMultiline && (
        <Icon
          id="arrowRight"
          className={cn(
            "text-[20px] opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100",
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
