import * as React from "react";
import { FaAngleRight } from "react-icons/fa";
import { ResourceIcon } from "../../core/userRole";
import {
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  LinkItemProps,
} from "../../ui/item";
import {
  Header,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { Section } from "../../ui/layouts/section";
import { Separator } from "../../ui/separator";

function MenuLinkItem({
  icon,
  children,
  ...rest
}: LinkItemProps & { icon: React.ReactNode }) {
  return (
    <li>
      <LinkItem {...rest}>
        <ItemIcon>{icon}</ItemIcon>

        <ItemContent>
          <ItemMainText>{children}</ItemMainText>
        </ItemContent>

        <ItemIcon>
          <FaAngleRight />
        </ItemIcon>
      </LinkItem>
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
        <Section>
          <ul>
            <MenuLinkItem
              href="/menu/articles"
              icon={<ResourceIcon resourceKey="blog" />}
            >
              Articles
            </MenuLinkItem>

            <li>
              <Separator />
            </li>

            <MenuLinkItem
              href="/menu/animal-species"
              icon={<ResourceIcon resourceKey="animal_breed" />}
            >
              Races animales
            </MenuLinkItem>

            <MenuLinkItem
              href="/menu/animal-characteristics"
              icon={<ResourceIcon resourceKey="animal_characteristic" />}
            >
              Caractéristiques animales
            </MenuLinkItem>

            <li>
              <Separator />
            </li>

            <MenuLinkItem
              href="/menu/users"
              icon={<ResourceIcon resourceKey="user" />}
            >
              Utilisateurs
            </MenuLinkItem>

            <MenuLinkItem
              href="/menu/user-roles"
              icon={<ResourceIcon resourceKey="user_role" />}
            >
              Rôles utilisateurs
            </MenuLinkItem>
          </ul>
        </Section>
      </Main>
    </>
  );
}
