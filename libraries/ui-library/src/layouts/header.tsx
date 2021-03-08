import cn from "classnames";
import * as React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ChildrenProp, Link, LinkProps, StyleProps } from "../core";
import { useIsScrollAtTheTop } from "./usePageScroll";

const HEADER_ACTION_CLASS_NAMES =
  "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 rounded-full w-8 h-8 flex-none flex items-center justify-center text-xl text-gray-800 active:text-opacity-20";

export function HeaderLink({ className, ...rest }: LinkProps) {
  return (
    <Link {...rest} className={cn(HEADER_ACTION_CLASS_NAMES, className)} />
  );
}

export function HeaderBackLink(props: LinkProps) {
  return (
    <HeaderLink {...props} isBack>
      <FaChevronLeft />
    </HeaderLink>
  );
}

export function HeaderTitle({
  className,
  children,
}: ChildrenProp & StyleProps) {
  return (
    <h1
      className={cn(
        "flex-1 min-w-0 truncate px-4 text-gray-800 text-lg font-bold font-serif",
        className
      )}
    >
      {children}
    </h1>
  );
}

export type HeaderProps = StyleProps & ChildrenProp;

export function Header({ className, children }: HeaderProps) {
  const { isAtTheTop } = useIsScrollAtTheTop();

  return (
    <header
      className={cn(
        "transition-shadow duration-200 ease-in-out z-20 fixed top-0 left-0 right-0 ring-1 bg-white w-full h-12 flex-none header-padding flex items-center",
        {
          "ring-transparent": isAtTheTop,
          "ring-gray-100": !isAtTheTop,
        },
        className
      )}
    >
      {children}
    </header>
  );
}
