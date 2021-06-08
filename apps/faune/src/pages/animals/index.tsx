import {
  AnimalStatus,
  doesGroupsIntersect,
  getAnimalDisplayName,
  SearchableAnimal,
  UserGroup,
} from "@animeaux/shared-entities";
import { QuickLinkAction } from "actions/quickAction";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { PageComponent } from "core/types";
import { Avatar } from "dataDisplay/avatar";
import { AvatarImage } from "dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "dataDisplay/item";
import { useAllActiveAnimals } from "entities/animal/queries";
import { useCurrentUser } from "entities/user/currentUserContext";
import { ApplicationLayout } from "layouts/applicationLayout";
import {
  Header,
  HeaderLink,
  HeaderTitle,
  HeaderUserAvatar,
} from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import { Section } from "layouts/section";
import { usePageScrollRestoration } from "layouts/usePageScroll";
import { Placeholder } from "loaders/placeholder";
import * as React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

const searchableAnimalItemPlaceholder = (
  <Item>
    <ItemIcon>
      <Placeholder preset="avatar" />
    </ItemIcon>

    <ItemContent>
      <ItemMainText>
        <Placeholder preset="label" />
      </ItemMainText>

      <ItemSecondaryText>
        <Placeholder preset="text" />
      </ItemSecondaryText>
    </ItemContent>
  </Item>
);

const StatusBadgeColors: { [key in AnimalStatus]: string } = {
  [AnimalStatus.ADOPTED]: "var(--success-500)",
  [AnimalStatus.DECEASED]: "var(--dark-700)",
  [AnimalStatus.FREE]: "var(--dark-700)",
  [AnimalStatus.OPEN_TO_ADOPTION]: "var(--primary-500)",
  [AnimalStatus.OPEN_TO_RESERVATION]: "var(--primary-500)",
  [AnimalStatus.RESERVED]: "var(--warning-500)",
  [AnimalStatus.UNAVAILABLE]: "var(--dark-700)",
};

function AnimalLinkItem({ animal }: { animal: SearchableAnimal }) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem href={`./${animal.id}`}>
      <ItemIcon style={{ position: "relative" }}>
        <Avatar>
          <AvatarImage image={animal.avatarId} alt={displayName} />
        </Avatar>

        <span
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            display: "inline-flex",
            height: "16px",
            width: "16px",
            borderRadius: "var(--border-radius-full)",
            border: "2px solid var(--bg-primary)",
            background: StatusBadgeColors[animal.status],
          }}
        />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>

        {animal.hostFamily != null && (
          <ItemSecondaryText>{animal.hostFamily.name}</ItemSecondaryText>
        )}
      </ItemContent>
    </LinkItem>
  );
}

const TITLE = "Animaux en charge";

const AnimalListPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  usePageScrollRestoration();

  const query = useAllActiveAnimals();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animal) => animal.id,
    renderPlaceholderItem: () => searchableAnimalItemPlaceholder,
    emptyMessage: "Il n'y a pas encore d'animaux",
    renderItem: (animal) => <AnimalLinkItem animal={animal} />,
  });

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>{title}</HeaderTitle>
        <HeaderLink href="./search">
          <FaSearch />
        </HeaderLink>
      </Header>

      <Main>
        <Section>{content}</Section>

        {isCurrentUserAdmin && (
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
