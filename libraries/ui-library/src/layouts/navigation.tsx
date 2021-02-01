import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { Link, LinkProps } from "../link";
import { useIsScrollAtTheBottom } from "./usePageScroll";

export function NavItem({
  className,
  ...rest
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li {...rest} className={cn("h-full flex-1", className)} />;
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

  return (
    <Link
      {...props}
      className={cn(
        "w-full h-full flex flex-col items-center justify-center text-gray-800",
        { "text-opacity-30 active:text-opacity-50": !active },
        className
      )}
    >
      <span className="flex-none text-2xl">{icon}</span>
      <span className="flex-none text-2xs">{label}</span>
    </Link>
  );
}

export function Navigation({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();

  return (
    <nav
      {...rest}
      className={cn(
        "z-20 fixed bottom-0 right-0 left-0 ring-1 bg-white navigation-pb transition-shadow duration-200 ease-in-out",
        {
          "ring-transparent": isAtTheBottom,
          "ring-gray-100": !isAtTheBottom,
        },
        className
      )}
    >
      <ul className="w-full h-14 flex">{children}</ul>
    </nav>
  );
}
