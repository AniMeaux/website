import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export function TabBar({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="fixed z-10 bottom-0 left-0 right-0 bg-white px-safe-1 pt-0.5 pb-safe-0.5 flex justify-evenly gap-1 md:hidden">
      {children}
    </nav>
  );
}

export function TabBarItem({
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
          "flex-none p-1 flex items-center justify-center text-[20px] transition-colors duration-100 ease-in-out",
          {
            "text-blue-500": isActive,
            "text-gray-500": !isActive,
          }
        )
      }
    >
      <Icon id={icon} />
    </BaseLink>
  );
}

export function TabBarMenu({
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
          "flex-none p-1 flex items-center justify-center text-[20px] transition-colors duration-100 ease-in-out",
          {
            "text-blue-500": isOpened,
            "text-gray-500": !isOpened,
          }
        )}
      >
        <Icon id={icon} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          sideOffset={15}
          collisionPadding={10}
          className="z-20 shadow-xl rounded-1 w-[200px] bg-white p-1 flex flex-col gap-1"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function TabBarMenuItem({
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
      <BaseLink isNavLink to={to} className="flex">
        {({ isActive }) => (
          <span
            className={cn(
              "pr-1 flex items-center transition-colors duration-100 ease-in-out",
              isActive ? "text-blue-500" : "text-gray-500"
            )}
          >
            <span className="w-4 h-4 flex-none flex items-center justify-center text-[20px]">
              <Icon id={icon} />
            </span>

            <span className="flex-1 text-body-emphasis">{label}</span>
          </span>
        )}
      </BaseLink>
    </DropdownMenu.Item>
  );
}
