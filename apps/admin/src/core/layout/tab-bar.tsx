import { cn } from "@animeaux/core"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useState } from "react"

import type { BaseLinkProps } from "#i/core/base-link.js"
import { BaseLink } from "#i/core/base-link.js"
import type { IconName } from "#i/generated/icon.js"
import { Icon } from "#i/generated/icon.js"
import { Spacing } from "#i/generated/theme.js"

export function TabBar({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {/*
       * Reserve some space in the main layout to make sure the fixed tab bar
       * doesn't hide anything.
       */}
      <div
        aria-hidden
        className="flex pt-0.5 pb-safe-0.5 before:h-4.5 before:w-1 md:hidden"
      />

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-flow-col gap-1 bg-white pt-0.5 px-safe-1.5 pb-safe-0.5 md:hidden">
        {children}
      </nav>
    </>
  )
}

TabBar.Item = function TabBarItem({
  icon,
  to,
}: {
  icon: IconName
  to: BaseLinkProps["to"]
}) {
  return (
    <BaseLink
      isNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center rounded-0.5 py-1 icon-2.5 transition-colors ease-in-out focus-visible:focus-ring",
          {
            "bg-blue-50 text-blue-500": isActive,
            "text-gray-500 hover:bg-gray-100 active:bg-gray-100": !isActive,
          },
        )
      }
    >
      <Icon href={icon} />
    </BaseLink>
  )
}

TabBar.Menu = function TabBarMenu({
  icon,
  children,
}: {
  icon: IconName
  children?: React.ReactNode
}) {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <DropdownMenu.Root open={isOpened} onOpenChange={setIsOpened}>
      <DropdownMenu.Trigger
        className={cn(
          "flex items-center justify-center rounded-0.5 py-1 icon-2 text-gray-500 transition-colors ease-in-out hover:bg-gray-100 focus-visible:focus-ring active:bg-gray-100",
          { "bg-gray-100": isOpened },
        )}
      >
        <Icon href={icon} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          sideOffset={Spacing.unitPx}
          collisionPadding={Spacing.unitPx}
          className="z-20 flex w-20 flex-col gap-1 rounded-1 bg-white p-1 shadow-popover-sm out-opacity-0 out-translate-y-2 data-opened:animate-enter data-closed:animate-exit"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

TabBar.MenuItem = function TabBarMenuItem({
  icon,
  label,
  to,
}: {
  icon: IconName
  label: string
  to: BaseLinkProps["to"]
}) {
  return (
    <DropdownMenu.Item asChild>
      <BaseLink
        isNavLink
        to={to}
        className="flex rounded-0.5 transition-colors ease-in-out hover:bg-gray-100 focus-visible:focus-ring active:bg-gray-100"
      >
        {({ isActive }) => (
          <span
            className={cn(
              "grid w-full grid-cols-auto-fr items-center rounded-0.5 pr-1 transition-colors ease-in-out",
              isActive ? "bg-blue-50 text-blue-500" : "text-gray-500",
            )}
          >
            <span className="flex size-4 items-center justify-center icon-2">
              <Icon href={icon} />
            </span>

            <span className="text-body-emphasis">{label}</span>
          </span>
        )}
      </BaseLink>
    </DropdownMenu.Item>
  )
}
