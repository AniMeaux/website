import { Link, LinkProps, ResourceLabels } from "@animeaux/shared";
import * as React from "react";
import { FaAngleRight } from "react-icons/fa";
import { UserRoleIcon } from "../../core/userRole";
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
          <MenuLinkItem
            href="/menu/host-families"
            Icon={UserRoleIcon.host_family}
          >
            Familles d'accueils
          </MenuLinkItem>

          <li>
            <Separator />
          </li>

          <MenuLinkItem href="/menu/users" Icon={UserRoleIcon.user}>
            Utilisateurs
          </MenuLinkItem>

          <MenuLinkItem href="/menu/user-roles" Icon={UserRoleIcon.user_role}>
            Rôles utilisateurs
          </MenuLinkItem>

          <li>
            <Separator />
          </li>

          <MenuLinkItem
            href="/menu/animal-species"
            Icon={UserRoleIcon.animal_breed}
          >
            Races animales
          </MenuLinkItem>

          <MenuLinkItem
            href="/menu/animal-characteristics"
            Icon={UserRoleIcon.animal_characteristic}
          >
            Caractéristiques animales
          </MenuLinkItem>
        </ul>
      </Main>
    </>
  );
}
