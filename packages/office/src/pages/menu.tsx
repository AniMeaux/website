import { Link, LinkProps } from "@animeaux/shared";
import * as React from "react";
import {
  FaAngleRight,
  FaDna,
  FaHome,
  FaShieldAlt,
  FaTag,
  FaUser,
} from "react-icons/fa";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../ui/layouts/header";
import { Main } from "../ui/layouts/main";
import { Separator } from "../ui/separator";

function MenuLinkItem({
  Icon,
  children,
  ...rest
}: LinkProps & { Icon: React.ElementType }) {
  return (
    <li>
      <Link {...rest} className="a11y-focus w-full h-12 px-2 flex items-center">
        <Icon className="mr-4" />
        <span className="flex-1">{children}</span>
        <FaAngleRight />
      </Link>
    </li>
  );
}

export default function MenuPage() {
  return (
    <>
      <Header>
        <HeaderBackLink href="/" />
        <HeaderTitle>Menu</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      <Main>
        <Separator large className="mb-2" />

        <ul className="px-2">
          <MenuLinkItem href="/host-families" Icon={FaHome}>
            Familles d'accueil
          </MenuLinkItem>

          <li>
            <Separator className="my-2" />
          </li>

          <MenuLinkItem href="/users" Icon={FaUser}>
            Utilisateurs
          </MenuLinkItem>

          <MenuLinkItem href="/user-roles" Icon={FaShieldAlt}>
            Rôles utilisateur
          </MenuLinkItem>

          <li>
            <Separator className="my-2" />
          </li>

          <MenuLinkItem href="/animal-species" Icon={FaDna}>
            Races animale
          </MenuLinkItem>

          <MenuLinkItem href="/animal-characteristics" Icon={FaTag}>
            Caracteristiques animale
          </MenuLinkItem>
        </ul>
      </Main>
    </>
  );
}
