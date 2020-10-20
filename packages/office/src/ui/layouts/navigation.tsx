import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { FaBars } from "react-icons/fa";
import { ResourceIcon } from "../../core/userRole";

type NavLinkProps = LinkProps & {
  label: string;
  icon: React.ReactNode;
  strict?: boolean;
};

function NavLink({ label, icon, strict = false, ...props }: NavLinkProps) {
  const router = useRouter();

  const active = strict
    ? router.asPath === props.href
    : router.asPath.startsWith(props.href);

  return (
    <Link
      {...props}
      className="h-full px-2 flex flex-col items-center justify-center"
    >
      <span
        className={cn("opacity-50 h-10 px-4 rounded-full flex items-center", {
          "opacity-100 bg-blue-100 text-blue-500": active,
        })}
      >
        <span className="text-lg">{icon}</span>
        {active && <span className="ml-2">{label}</span>}
      </span>
    </Link>
  );
}

export function Navigation() {
  return (
    <footer className="z-30 fixed bottom-0 left-0 right-0 h-16 border-t bg-white">
      <nav className="h-full">
        <ul className="h-full flex">
          <li className="flex-1">
            <NavLink
              label="Animaux"
              icon={<ResourceIcon resourceKey="animal" />}
              href="/"
              strict
            />
          </li>

          <li className="flex-1">
            <NavLink
              label="FA"
              icon={<ResourceIcon resourceKey="host_family" />}
              href="/host-families"
            />
          </li>

          <li className="flex-1">
            <NavLink
              label="Partenaires"
              icon={<ResourceIcon resourceKey="partner" />}
              href="/partners"
            />
          </li>

          <li className="flex-1">
            <NavLink label="Menu" icon={<FaBars />} href="/menu" />
          </li>
        </ul>
      </nav>
    </footer>
  );
}
