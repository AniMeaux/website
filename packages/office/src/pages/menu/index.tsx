import { useRouter } from "next/router";
import * as React from "react";
import { FaAngleRight } from "react-icons/fa";
import { ResourceIcon } from "../../core/resource";
import { ScreenSize, useScreenSize } from "../../core/screenSize";
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
import { Main, PageLayout, PageTitle } from "../../ui/layouts/page";
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
  const { screenSize } = useScreenSize();
  const router = useRouter();

  React.useLayoutEffect(() => {
    if (screenSize > ScreenSize.SMALL) {
      router.replace("/");
    }
  }, [screenSize, router]);

  return (
    <PageLayout
      header={
        <Header>
          <HeaderPlaceholder />
          <HeaderTitle>Menu</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Menu" />

      <Main>
        <Section>
          <ul>
            <MenuLinkItem
              href="articles"
              icon={<ResourceIcon resourceKey="blog" />}
            >
              Articles
            </MenuLinkItem>

            <li>
              <Separator />
            </li>

            <MenuLinkItem
              href="animal-species"
              icon={<ResourceIcon resourceKey="animal_breed" />}
            >
              Races animales
            </MenuLinkItem>

            <MenuLinkItem
              href="animal-characteristics"
              icon={<ResourceIcon resourceKey="animal_characteristic" />}
            >
              Caractéristiques animales
            </MenuLinkItem>

            <li>
              <Separator />
            </li>

            <MenuLinkItem
              href="users"
              icon={<ResourceIcon resourceKey="user" />}
            >
              Utilisateurs
            </MenuLinkItem>

            <MenuLinkItem
              href="user-roles"
              icon={<ResourceIcon resourceKey="user_role" />}
            >
              Rôles utilisateurs
            </MenuLinkItem>
          </ul>
        </Section>
      </Main>
    </PageLayout>
  );
}
