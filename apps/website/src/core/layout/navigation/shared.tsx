import { cn } from "@animeaux/core"
import type { Location } from "history"
import { forwardRef } from "react"

import type { BaseLinkProps } from "#i/core/base-link.js"
import { BaseLink } from "#i/core/base-link.js"
import type { IconProps } from "#i/generated/icon.js"
import { Icon } from "#i/generated/icon.js"

export type NavGroup = "act" | "adopt" | "discover" | "warn"

export const navLinkClassName = ({
  isActive = false,
}: {
  isActive?: boolean
} = {}) =>
  cn("flex items-center justify-between gap-1 px-3 py-2", {
    "text-black": isActive,
    "text-gray-700 hover:text-black": !isActive,
  })

export type SubNavComponent = React.FC & {
  isActive: (location: Location) => boolean
}

type SubNavItemColor = "blue" | "cyan" | "green" | "red" | "yellow"

const subNavItemBgColorClassName: Record<SubNavItemColor, string> = {
  blue: cn("bg-transparent hover:bg-brand-blue-lightest"),
  cyan: cn("bg-transparent hover:bg-brand-cyan-lightest"),
  green: cn("bg-transparent hover:bg-brand-green-lightest"),
  red: cn("bg-transparent hover:bg-brand-red-lightest"),
  yellow: cn("bg-transparent hover:bg-brand-yellow-lightest"),
}

const subNavItemIconBgColorClassName: Record<SubNavItemColor, string> = {
  blue: cn("bg-brand-blue-lightest"),
  cyan: cn("bg-brand-cyan-lightest"),
  green: cn("bg-brand-green-lightest"),
  red: cn("bg-brand-red-lightest"),
  yellow: cn("bg-brand-yellow-lightest"),
}

const subNavItemTextColorClassName: Record<SubNavItemColor, string> = {
  blue: cn("text-brand-blue"),
  cyan: cn("text-brand-cyan"),
  green: cn("text-brand-green"),
  red: cn("text-brand-red"),
  yellow: cn("text-brand-yellow-darker"),
}

export const SubNavItem = forwardRef<
  HTMLAnchorElement,
  {
    to: BaseLinkProps["to"]
    icon: IconProps["id"]
    children: string
    isMultiline?: boolean
    color: SubNavItemColor
  }
>(function SubNavItem({ to, icon, children, color, isMultiline = false }, ref) {
  return (
    <BaseLink
      ref={ref}
      to={to}
      className={cn(
        "group flex items-center rounded-bubble-sm px-3 py-2 transition-colors",
        subNavItemBgColorClassName[color],
        {
          "flex-col gap-1": isMultiline,
          "gap-3": !isMultiline,
        },
      )}
    >
      <span
        className={cn(
          "flex rounded-bubble-sm transition-colors",
          {
            "p-3 icon-32": isMultiline,
            "p-2 icon-20": !isMultiline,
          },
          subNavItemIconBgColorClassName[color],
          subNavItemTextColorClassName[color],
        )}
      >
        <Icon id={icon} />
      </span>

      <span className="min-w-0 flex-1">{children}</span>

      {!isMultiline && (
        <Icon
          id="arrow-right"
          className={cn(
            "icon-20 opacity-0 transition-opacity group-hover:opacity-100",
            subNavItemTextColorClassName[color],
          )}
        />
      )}
    </BaseLink>
  )
})

export function handleEscape(callback: () => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !event.isDefaultPrevented()) {
      event.preventDefault()
      callback()
    }
  }
}
