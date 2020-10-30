import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaBars } from "react-icons/fa";
import { ResourceIcon } from "../../core/resource";
import { ScreenSize, useScreenSize } from "../../core/screenSize";
import { Button } from "../button";
import Logo from "../logoWithColors.svg";
import { Separator } from "../separator";
import { Tag, TagIcon, TagText } from "../tag";

function NavItem(props: React.HTMLAttributes<HTMLLIElement>) {
  return <li {...props} className="flex-1 md:flex-none" />;
}

type NavLinkProps = LinkProps & {
  label: string;
  icon: React.ReactNode;
  strict?: boolean;
  isNavExpanded: boolean;
};

function NavLink({
  label,
  icon,
  strict = false,
  isNavExpanded,
  ...props
}: NavLinkProps) {
  const router = useRouter();
  const { screenSize } = useScreenSize();

  const currentPath = router.asPath.split("?")[0];

  const active = strict
    ? currentPath === props.href
    : currentPath.startsWith(props.href);

  let showLabel: boolean;
  if (screenSize === ScreenSize.SMALL) {
    showLabel = active;
  } else {
    showLabel = isNavExpanded;
  }

  return (
    <Link
      {...props}
      className="h-full md:h-12 px-2 md:px-0 flex flex-col items-center md:items-stretch justify-center"
    >
      <Tag size="large" color={active ? "blue" : "white"}>
        <TagIcon>{icon}</TagIcon>
        {showLabel && <TagText>{label}</TagText>}
      </Tag>
    </Link>
  );
}

export function Navigation(props: React.HTMLAttributes<HTMLElement>) {
  const { screenSize } = useScreenSize();
  const [isNavExpanded, setIsNavExpanded] = React.useState(true);

  return (
    <div
      {...props}
      className={cn(
        "z-30 fixed md:static right-0 bottom-0 left-0 h-16 md:h-auto md:flex-none border-t md:border-t-0 md:border-r bg-white flex md:flex-col",
        { "md:w-2/12 md:min-w-fit-content": isNavExpanded }
      )}
    >
      {screenSize > ScreenSize.SMALL && (
        <div className="w-full h-16 flex-none flex items-center justify-center text-4xl">
          <Logo />
        </div>
      )}

      <nav className="w-full h-full md:h-auto flex-1 md:min-h-0 md:overflow-auto">
        <ul className="h-full md:px-2 md:py-4 flex md:flex-col">
          <NavItem>
            <NavLink
              label="Animaux"
              icon={<ResourceIcon resourceKey="animal" />}
              href="/"
              strict
              isNavExpanded={isNavExpanded}
            />
          </NavItem>

          <NavItem>
            <NavLink
              label={
                screenSize === ScreenSize.SMALL ? "FA" : "Familles d'accueil"
              }
              icon={<ResourceIcon resourceKey="host_family" />}
              href="/host-families"
              isNavExpanded={isNavExpanded}
            />
          </NavItem>

          <NavItem>
            <NavLink
              label="Partenaires"
              icon={<ResourceIcon resourceKey="partner" />}
              href="/partners"
              isNavExpanded={isNavExpanded}
            />
          </NavItem>

          {screenSize === ScreenSize.SMALL && (
            <NavItem>
              <NavLink
                label="Menu"
                icon={<FaBars />}
                href="/menu"
                isNavExpanded={isNavExpanded}
              />
            </NavItem>
          )}

          {screenSize > ScreenSize.SMALL && (
            <>
              <NavItem>
                <Separator className="mx-4" />
              </NavItem>

              <NavItem>
                <NavLink
                  label="Articles"
                  icon={<ResourceIcon resourceKey="blog" />}
                  href="/menu/articles"
                  isNavExpanded={isNavExpanded}
                />
              </NavItem>

              <NavItem>
                <Separator className="mx-4" />
              </NavItem>

              <NavItem>
                <NavLink
                  label="Races animales"
                  icon={<ResourceIcon resourceKey="animal_breed" />}
                  href="/menu/animal-species"
                  isNavExpanded={isNavExpanded}
                />
              </NavItem>

              <NavItem>
                <NavLink
                  label="Caractéristiques animales"
                  icon={<ResourceIcon resourceKey="animal_characteristic" />}
                  href="/menu/animal-characteristics"
                  isNavExpanded={isNavExpanded}
                />
              </NavItem>

              <NavItem>
                <Separator className="mx-4" />
              </NavItem>

              <NavItem>
                <NavLink
                  label="Utilisateurs"
                  icon={<ResourceIcon resourceKey="user" />}
                  href="/menu/users"
                  isNavExpanded={isNavExpanded}
                />
              </NavItem>

              <NavItem>
                <NavLink
                  label="Rôles utilisateurs"
                  icon={<ResourceIcon resourceKey="user_role" />}
                  href="/menu/user-roles"
                  isNavExpanded={isNavExpanded}
                />
              </NavItem>
            </>
          )}
        </ul>
      </nav>

      {screenSize > ScreenSize.SMALL && (
        <div className="flex-none h-16 px-2 flex items-center justify-center">
          <Button
            onClick={() => setIsNavExpanded((e) => !e)}
            className="w-full flex items-center justify-center"
            iconOnly={!isNavExpanded}
          >
            {isNavExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
            {isNavExpanded && <span className="ml-4">Reduire</span>}
          </Button>
        </div>
      )}
    </div>
  );
}
