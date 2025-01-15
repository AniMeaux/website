import type { BaseLinkProps } from "#core/base-link";
import { BaseLink } from "#core/base-link";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";

export type SideBarProps = {
  isOpened: boolean;
  onIsOpenedChange: () => void;
  children?: React.ReactNode;
};

export function SideBar({
  isOpened,
  onIsOpenedChange,
  children,
}: SideBarProps) {
  return (
    <nav className="sticky top-0 hidden h-screen bg-white pr-2 pb-safe-2 pl-safe-2 pt-safe-1 md:flex">
      <div
        className={cn(
          "flex h-full flex-col gap-4 transition-[width] duration-200 ease-in-out",
          isOpened ? "w-[210px]" : "w-[40px]",
        )}
      >
        {children}

        <SideBar.Item asChild>
          <button onClick={onIsOpenedChange}>
            <SideBar.ItemIcon
              href={
                isOpened ? "icon-angles-left-solid" : "icon-angles-right-solid"
              }
            />
            <SideBar.ItemContent>Réduire</SideBar.ItemContent>
          </button>
        </SideBar.Item>
      </div>
    </nav>
  );
}

SideBar.RootItem = function SideBarRootItem({
  to,
  logo,
  alt,
}: {
  to: BaseLinkProps["to"];
  logo: string;
  alt: string;
}) {
  return (
    <BaseLink
      to={to}
      className="flex flex-none overflow-hidden rounded-0.5 p-0.5 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:focus-compact-blue-400 hover:bg-gray-100"
    >
      <img src={logo} alt={alt} className="h-3 object-cover object-left" />
    </BaseLink>
  );
};

SideBar.Content = function SideBarContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col justify-start gap-1">{children}</div>
  );
};

SideBar.Item = function SideBarItem({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.span>) {
  return (
    <Primitive.span
      {...rest}
      className={cn(
        "flex flex-none items-center overflow-hidden rounded-0.5 text-left text-gray-500 transition-colors duration-100 ease-in-out aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-500 focus-visible:focus-compact-blue-400 hover:bg-gray-100 aria-[current=page]:hover:bg-blue-50",
      )}
    />
  );
};

SideBar.ItemIcon = function SideBarItemIcon(
  props: React.ComponentPropsWithoutRef<typeof Icon>,
) {
  return (
    <span className="flex h-4 w-4 flex-none items-center justify-center text-[20px]">
      <Icon {...props} />
    </span>
  );
};

SideBar.ItemContent = function SideBarItemContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="flex-1 truncate pr-1 text-body-emphasis">{children}</span>
  );
};
