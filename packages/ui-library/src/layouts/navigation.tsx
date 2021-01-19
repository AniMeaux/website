import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { Link, LinkProps } from "../link";

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
        "w-full h-full flex flex-col items-center justify-center",
        {
          "text-blue-500": active,
          "text-default-color text-opacity-50": !active,
        },
        className
      )}
    >
      <span className="flex-none text-xl">{icon}</span>
      <span className="flex-none text-2xs">{label}</span>
    </Link>
  );
}

export function Navigation({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      {...rest}
      className={cn(
        "z-20 fixed right-0 navigation-bottom left-0 h-14 border-t bg-white",
        className
      )}
    >
      <ul className="w-full h-full flex">{children}</ul>
    </nav>
  );
}
