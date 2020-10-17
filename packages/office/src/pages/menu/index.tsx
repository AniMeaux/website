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
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { Separator } from "../../ui/separator";

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
        <HeaderPlaceholder />
        <HeaderTitle>Menu</HeaderTitle>
        <HeaderCurrentUserAvatar />
      </Header>

      <Main>
        <ul className="px-2">
          <MenuLinkItem href="/menu/host-families" Icon={FaHome}>
            Familles d'accueil
          </MenuLinkItem>

          <li>
            <Separator />
          </li>

          <MenuLinkItem href="/menu/users" Icon={FaUser}>
            Utilisateurs
          </MenuLinkItem>

          <MenuLinkItem href="/menu/user-roles" Icon={FaShieldAlt}>
            Rôles utilisateur
          </MenuLinkItem>

          <li>
            <Separator />
          </li>

          <MenuLinkItem href="/menu/animal-species" Icon={FaDna}>
            Races animale
          </MenuLinkItem>

          <MenuLinkItem href="/menu/animal-characteristics" Icon={FaTag}>
            Caracteristiques animale
          </MenuLinkItem>
        </ul>
      </Main>
    </>
  );
}
