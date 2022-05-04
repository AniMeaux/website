import {
  AnimalActiveBrief,
  doesGroupsIntersect,
  UserGroup,
} from "@animeaux/shared";
import { FaPlus, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { useCurrentUser } from "~/account/currentUser";
import { StatusBadge } from "~/animal/status/badge";
import { StatusIcon } from "~/animal/status/icon";
import { QuickLinkAction } from "~/core/actions/quickAction";
import { BaseLink } from "~/core/baseLink";
import { Avatar, AvatarPlaceholder } from "~/core/dataDisplay/avatar";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import { AvatarImage } from "~/core/dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import {
  Header,
  HeaderLink,
  HeaderTitle,
  HeaderUserAvatar,
} from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section } from "~/core/layouts/section";
import { usePageScrollRestoration } from "~/core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { ScreenSize, useScreenSize } from "~/core/screenSize";
import { PageComponent } from "~/core/types";
import { theme } from "~/styles/theme";

const TITLE = "Animaux en charge";

const AnimalListPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const currentUserCanEdit = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const haveManagedAnimals = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  usePageScrollRestoration();

  const router = useRouter();
  const searchParams = new URLSearchParams(router.asPath.split("?")[1]);

  const onlyManagedByCurrentUser =
    haveManagedAnimals && searchParams.get("tab") === "mine";

  const getAllActiveAnimals = useOperationQuery({
    name: "getAllActiveAnimals",
    params: { onlyManagedByCurrentUser },
  });

  if (getAllActiveAnimals.state === "error") {
    return <ErrorPage status={getAllActiveAnimals.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllActiveAnimals.state === "success") {
    if (getAllActiveAnimals.result.length === 0) {
      content = (
        <EmptyMessage>
          {onlyManagedByCurrentUser
            ? "Vous n'avez aucun animal à votre charge"
            : "Il n'y a pas encore d'animaux"}
        </EmptyMessage>
      );
    } else {
      content = (
        <ul>
          {getAllActiveAnimals.result.map((animal) => (
            <li key={animal.id}>
              <AnimalItem animal={animal} />
            </li>
          ))}
        </ul>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <AnimalItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>
          {TITLE}{" "}
          {getAllActiveAnimals.state === "success" &&
            `(${getAllActiveAnimals.result.length})`}
        </HeaderTitle>
        <HeaderLink href="./search">
          <FaSearch />
        </HeaderLink>
      </Header>

      <Main>
        {haveManagedAnimals && (
          <Section>
            <Tabs>
              <Tab href="" disabled={!onlyManagedByCurrentUser}>
                Tous
              </Tab>
              <Tab href="?tab=mine" disabled={onlyManagedByCurrentUser}>
                À ma charge
              </Tab>
            </Tabs>
          </Section>
        )}

        <Section>{content}</Section>

        {currentUserCanEdit && (
          <QuickLinkAction href="./new/profile">
            <FaPlus />
          </QuickLinkAction>
        )}
      </Main>

      <Navigation />
    </ApplicationLayout>
  );
};

AnimalListPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
  UserGroup.VETERINARIAN,
];

export default AnimalListPage;

const Tabs = styled.nav`
  border-radius: ${theme.borderRadius.l};
  background: ${theme.colors.dark[50]};
  padding: ${theme.spacing.x1};
  display: flex;
  gap: ${theme.spacing.x2};
`;

const Tab = styled(BaseLink)`
  flex: 1;
  border-radius: ${theme.borderRadius.l};
  background: ${(props) => (props.disabled ? theme.colors.light[1000] : null)};
  padding: ${theme.spacing.x2} ${theme.spacing.x4};
  text-align: center;

  &:not([aria-disabled]) {
    @media (hover: hover) {
      &:hover {
        background: ${theme.colors.light[400]};
      }
    }

    &:active {
      background: ${theme.colors.light[800]};
    }
  }
`;

function AnimalItem({ animal }: { animal: AnimalActiveBrief }) {
  const { screenSize } = useScreenSize();

  return (
    <LinkItem href={`./${animal.id}`}>
      <ItemIcon>
        <Avatar>
          <AvatarImage image={animal.avatarId} alt={animal.displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animal.displayName}</ItemMainText>

        {animal.managerName != null && (
          <ItemSecondaryText>{animal.managerName}</ItemSecondaryText>
        )}
      </ItemContent>

      <ItemIcon small>
        {screenSize <= ScreenSize.SMALL ? (
          <StatusIcon status={animal.status} />
        ) : (
          <StatusBadge isSmall status={animal.status} />
        )}
      </ItemIcon>
    </LinkItem>
  );
}

function AnimalItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <AvatarPlaceholder />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder $preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}
