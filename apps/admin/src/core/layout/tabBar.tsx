import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import { theme } from "#generated/theme.ts";
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
        className="flex pt-0.5 pb-safe-0.5 before:h-4 before:w-1 md:hidden"
      />

      <nav className="fixed z-20 bottom-0 left-0 right-0 bg-white px-safe-1 pt-0.5 pb-safe-0.5 grid grid-flow-col gap-1 md:hidden">
        {children}
      </nav>
    </>
  );
}

TabBar.Item = function TabBarItem({
  icon,
  to,
}: {
  icon: IconProps["id"];
  to: BaseLinkProps["to"];
}) {
  return (
    <BaseLink
      isNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-0.5 py-1 flex items-center justify-center text-[25px] transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400",
          {
            "bg-blue-50 text-blue-500": isActive,
            "text-gray-500 hover:bg-gray-100 active:bg-gray-100": !isActive,
          },
        )
      }
    >
      <Icon id={icon} />
    </BaseLink>
  );
};

TabBar.Menu = function TabBarMenu({
  icon,
  children,
}: {
  icon: IconProps["id"];
  children?: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <DropdownMenu.Root open={isOpened} onOpenChange={setIsOpened}>
      <DropdownMenu.Trigger
        className={cn(
          "rounded-0.5 py-1 flex items-center justify-center text-[20px] text-gray-500 transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400",
          { "bg-gray-100": isOpened },
        )}
      >
        <Icon id={icon} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          sideOffset={theme.spacing[1]}
          collisionPadding={theme.spacing[1]}
          className="z-20 shadow-ambient rounded-1 w-[200px] bg-white p-1 flex flex-col gap-1"
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
  icon: IconProps["id"];
  label: string;
  to: BaseLinkProps["to"];
}) {
  return (
    <DropdownMenu.Item asChild>
      <BaseLink
        isNavLink
        to={to}
        className="rounded-0.5 flex transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
      >
        {({ isActive }) => (
          <span
            className={cn(
              "w-full rounded-0.5 pr-1 grid grid-cols-[auto,minmax(0px,1fr)] items-center transition-colors duration-100 ease-in-out",
              isActive ? "bg-blue-50 text-blue-500" : "text-gray-500",
            )}
          >
            <span className="w-4 h-4 flex items-center justify-center text-[20px]">
              <Icon id={icon} />
            </span>

            <span className="text-body-emphasis">{label}</span>
          </span>
        )}
      </BaseLink>
    </DropdownMenu.Item>
  );
};
