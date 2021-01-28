import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { Button } from "../button";
import { Link, LinkProps } from "../link";
import { ScreenSize, useScreenSize } from "../screenSize";
import { useApplicationLayout } from "./applicationLayout";

export function NavItem({
  className,
  ...rest
}: React.HTMLAttributes<HTMLLIElement>) {
  const {
    hasBottomNavigation,
    hasLeftNavigation,
    isNavigationCollapsed,
  } = useApplicationLayout();

  return (
    <li
      {...rest}
      className={cn(
        {
          "h-full flex-1": hasBottomNavigation,
          "flex-none": hasLeftNavigation,
          "w-full": hasLeftNavigation && !isNavigationCollapsed,
        },
        className
      )}
    />
  );
}

export type NavLinkProps = LinkProps & {
  label: string;
  icon: React.ReactNode;
  strict?: boolean;
};

export function NavLink({
  label,
  icon,
  strict = false,
  className,
  ...props
}: NavLinkProps) {
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];

  const active = strict
    ? currentPath === props.href
    : currentPath.startsWith(props.href);

  const {
    hasBottomNavigation,
    hasLeftNavigation,
    isNavigationCollapsed,
  } = useApplicationLayout();

  return (
    <Link
      {...props}
      className={cn(
        "w-full flex items-center",
        {
          "text-blue-500": active,
          "text-default-color": !active,
          "text-opacity-50": !active && hasBottomNavigation,
          "text-opacity-80 hover:text-opacity-100":
            !active && hasLeftNavigation,
        },
        {
          "h-full flex-col justify-center": hasBottomNavigation,
          "h-12 px-2": hasLeftNavigation,
        },
        className
      )}
    >
      <span
        className={cn("flex-none", {
          "text-2xl": hasBottomNavigation,
          "text-lg w-10 flex justify-center": hasLeftNavigation,
        })}
      >
        {icon}
      </span>

      {(!hasLeftNavigation || !isNavigationCollapsed) && (
        <span
          className={cn({
            "flex-none text-2xs": hasBottomNavigation,
            "ml-4 flex-1 min-w-0 truncate": hasLeftNavigation,
          })}
        >
          {label}
        </span>
      )}
    </Link>
  );
}

export function Navigation({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  const { screenSize } = useScreenSize();
  const isBottomNavigation = screenSize === ScreenSize.SMALL;

  // Just for readability.
  const isLeftNavigation = !isBottomNavigation;

  const { isNavigationCollapsed, setState } = useApplicationLayout();

  React.useLayoutEffect(() => {
    if (isBottomNavigation) {
      setState((state) => ({
        ...state,
        hasBottomNavigation: true,
        hasLeftNavigation: false,
      }));
    } else {
      setState((state) => ({
        ...state,
        hasBottomNavigation: false,
        hasLeftNavigation: true,
      }));
    }

    return () => {
      setState((state) => ({
        ...state,
        hasBottomNavigation: false,
        hasLeftNavigation: false,
      }));
    };
  }, [isBottomNavigation, setState]);

  return (
    <nav
      {...rest}
      className={cn(
        "z-20 fixed bottom-0 navigation-pb left-0 bg-white",
        {
          "right-0": isBottomNavigation,
          "top-16 border-r flex flex-col": isLeftNavigation,
          "w-18 items-center": isLeftNavigation && isNavigationCollapsed,
          "w-64": isLeftNavigation && !isNavigationCollapsed,
        },
        className
      )}
    >
      <ul
        className={cn("w-full flex", {
          "h-14 border-t": isBottomNavigation,
          "py-8 flex-1 flex-col items-center overflow-auto": isLeftNavigation,
          "px-2": isLeftNavigation && !isNavigationCollapsed,
        })}
      >
        {children}
      </ul>

      {isLeftNavigation && (
        <Button
          iconOnly={isNavigationCollapsed}
          onClick={() =>
            setState((state) => ({
              ...state,
              isNavigationCollapsed: !state.isNavigationCollapsed,
            }))
          }
          className={cn({
            "mb-8": isLeftNavigation,
            "mx-2": isLeftNavigation && !isNavigationCollapsed,
          })}
        >
          {isNavigationCollapsed ? (
            <FaAngleDoubleRight />
          ) : (
            <FaAngleDoubleLeft />
          )}

          {!isNavigationCollapsed && <span className="ml-4">Reduire</span>}
        </Button>
      )}
    </nav>
  );
}
