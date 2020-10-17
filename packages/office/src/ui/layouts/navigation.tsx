import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { FaBars, FaHandshake, FaParagraph } from "react-icons/fa";
import { UrlObject } from "url";
import Logo from "../logo.svg";

function NavItemIcon({ Icon }: { Icon: React.ElementType }) {
  return <Icon className="text-xl" />;
}

function NavItemLabel({ children }: { children: string }) {
  return <span className="text-xs">{children}</span>;
}

function getPathname(url: string | UrlObject): string {
  if (typeof url === "string") {
    return url;
  }

  return url.pathname!;
}

function NavLink({
  strict = false,
  ...props
}: LinkProps & { strict?: boolean }) {
  const router = useRouter();
  let pathname: string;

  if (props.as == null) {
    pathname = getPathname(props.href);
  } else {
    pathname = getPathname(props.as);
  }

  const active = strict
    ? router.asPath === pathname
    : router.asPath.startsWith(pathname);

  return (
    <Link
      {...props}
      className={cn(
        "h-full opacity-50 flex flex-col items-center justify-center",
        {
          "opacity-100 text-blue-500": active,
        }
      )}
    />
  );
}

export function Navigation() {
  return (
    <footer className="z-30 fixed bottom-0 left-0 right-0 h-16 border-t bg-white">
      <nav className="h-full">
        <ul className="h-full flex">
          <li className="flex-1">
            <NavLink href="/" strict>
              <NavItemIcon Icon={Logo} />
              <NavItemLabel>Animaux</NavItemLabel>
            </NavLink>
          </li>

          <li className="flex-1">
            <NavLink href="/articles">
              <NavItemIcon Icon={FaParagraph} />
              <NavItemLabel>Articles</NavItemLabel>
            </NavLink>
          </li>

          <li className="flex-1">
            <NavLink href="/partners">
              <NavItemIcon Icon={FaHandshake} />
              <NavItemLabel>Partenaires</NavItemLabel>
            </NavLink>
          </li>

          <li className="flex-1">
            <NavLink href="/menu">
              <NavItemIcon Icon={FaBars} />
              <NavItemLabel>Menu</NavItemLabel>
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
