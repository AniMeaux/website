import type { BaseLinkProps } from "#core/base-link";
import { BaseLink } from "#core/base-link";
import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { theme } from "#generated/theme";
import { cn } from "@animeaux/core";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

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

      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-flow-col gap-1 bg-white pt-0.5 bg-var-white pb-safe-0.5 px-safe-1.5 md:hidden">
        {children}
      </nav>
    </>
  );
}

TabBar.Item = function TabBarItem({
  icon,
  to,
}: {
  icon: IconName;
  to: BaseLinkProps["to"];
}) {
  return (
    <BaseLink
      isNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center rounded-0.5 py-1 text-[25px] transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400",
          {
            "bg-blue-50 text-blue-500": isActive,
            "text-gray-500 active:bg-gray-100 hover:bg-gray-100": !isActive,
          },
        )
      }
    >
      <Icon href={icon} />
    </BaseLink>
  );
};

TabBar.Menu = function TabBarMenu({
  icon,
  children,
}: {
  icon: IconName;
  children?: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <DropdownMenu.Root open={isOpened} onOpenChange={setIsOpened}>
      <DropdownMenu.Trigger
        className={cn(
          "flex items-center justify-center rounded-0.5 py-1 text-[20px] text-gray-500 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 hover:bg-gray-100",
          { "bg-gray-100": isOpened },
        )}
      >
        <Icon href={icon} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
          className="z-20 flex w-[200px] flex-col gap-1 rounded-1 bg-white p-1 shadow-popover-sm animation-opacity-0 animation-duration-100 animation-translate-y-2 bg-var-white data-[state=open]:animation-enter data-[state=closed]:animation-exit"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

TabBar.MenuItem = function TabBarMenuItem({
  icon,
  label,
  to,
}: {
  icon: IconName;
  label: string;
  to: BaseLinkProps["to"];
}) {
  return (
    <DropdownMenu.Item asChild>
      <BaseLink
        isNavLink
        to={to}
        className="flex rounded-0.5 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 hover:bg-gray-100"
      >
        {({ isActive }) => (
          <span
            className={cn(
              "grid w-full grid-cols-[auto,minmax(0px,1fr)] items-center rounded-0.5 pr-1 transition-colors duration-100 ease-in-out",
              isActive ? "bg-blue-50 text-blue-500" : "text-gray-500",
            )}
          >
            <span className="flex h-4 w-4 items-center justify-center text-[20px]">
              <Icon href={icon} />
            </span>

            <span className="text-body-emphasis">{label}</span>
          </span>
        )}
      </BaseLink>
    </DropdownMenu.Item>
  );
};
