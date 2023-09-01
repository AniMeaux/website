import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
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
    <nav className="hidden sticky top-0 h-screen bg-white pl-safe-2 pt-safe-1 pb-safe-2 pr-2 md:flex">
      <div
        className={cn(
          "h-full flex flex-col gap-4 transition-[width] duration-200 ease-in-out",
          isOpened ? "w-[210px]" : "w-[40px]",
        )}
      >
        {children}

        <SideBar.Item asChild>
          <button onClick={onIsOpenedChange}>
            <SideBar.ItemIcon id={isOpened ? "anglesLeft" : "anglesRight"} />
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
      className="overflow-hidden flex-none rounded-0.5 p-0.5 flex transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
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
    <div className="flex-1 flex flex-col justify-start gap-1">{children}</div>
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
        "overflow-hidden flex-none rounded-0.5 flex items-center text-left text-gray-500 transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 hover:bg-gray-100 aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-500 aria-[current=page]:hover:bg-blue-50",
      )}
    />
  );
};

SideBar.ItemIcon = function SideBarItemIcon({ id }: { id: IconProps["id"] }) {
  return (
    <span className="w-4 h-4 flex-none flex items-center justify-center text-[20px]">
      <Icon id={id} />
    </span>
  );
};

SideBar.ItemContent = function SideBarItemContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="flex-1 pr-1 text-body-emphasis truncate">{children}</span>
  );
};
