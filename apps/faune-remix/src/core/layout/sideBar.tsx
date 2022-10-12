import { useState } from "react";
import { Transition } from "react-transition-group";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export function SideBar({ children }: { children?: React.ReactNode }) {
  const [isOpened, setIsOpened] = useState(true);

  return (
    <Transition in={isOpened} timeout={200}>
      {(transitionStatus) => (
        <nav
          className={cn(
            "hidden sticky top-0 h-screen bg-white pl-safe-2 pt-safe-1 pb-safe-2 pr-2 grid-cols-1 grid-rows-[auto_minmax(0px,1fr)_auto] gap-4 transition-[width] duration-200 ease-in-out md:grid",
            {
              "w-[80px]":
                transitionStatus === "exited" || transitionStatus === "exiting",
              "w-[250px]":
                transitionStatus === "entered" ||
                transitionStatus === "entering",
            }
          )}
        >
          {children}

          <button
            onClick={() => setIsOpened((isOpened) => !isOpened)}
            className={itemClassName()}
          >
            <BaseSideBarItem icon={isOpened ? "anglesLeft" : "anglesRight"}>
              Réduire
            </BaseSideBarItem>
          </button>
        </nav>
      )}
    </Transition>
  );
}

export function SideBarRootItem({
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
      className="overflow-hidden rounded-0.5 p-0.5 grid transition-colors duration-100 ease-in-out hover:bg-gray-100 active:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
    >
      <img src={logo} alt={alt} className="h-3 object-cover object-left" />
    </BaseLink>
  );
}

export function SideBarContent({ children }: { children?: React.ReactNode }) {
  return <div className="grid grid-cols-1 content-start gap-1">{children}</div>;
}

export function SideBarItem({
  icon,
  to,
  children,
}: {
  icon: IconProps["id"];
  to: BaseLinkProps["to"];
  children?: React.ReactNode;
}) {
  return (
    <BaseLink
      isNavLink
      to={to}
      className={({ isActive }) => itemClassName({ isActive })}
    >
      <BaseSideBarItem icon={icon}>{children}</BaseSideBarItem>
    </BaseLink>
  );
}

function itemClassName({ isActive = false }: { isActive?: boolean } = {}) {
  return cn(
    "overflow-hidden rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)] items-center text-left transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400",
    {
      "bg-blue-50 text-blue-500": isActive,
      "text-gray-500 hover:bg-gray-100 active:bg-gray-100": !isActive,
    }
  );
}

function BaseSideBarItem({
  icon,
  children,
}: {
  icon: IconProps["id"];
  children?: React.ReactNode;
}) {
  return (
    <>
      <span className="w-4 h-4 flex items-center justify-center text-[20px]">
        <Icon id={icon} />
      </span>

      <span className="pr-1 text-body-emphasis">{children}</span>
    </>
  );
}
