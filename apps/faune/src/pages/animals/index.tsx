import {
  Header,
  PageComponent,
  renderInfiniteItemList,
  useAllActiveAnimals,
  useCurrentUser,
} from "@animeaux/app-core";
import {
  AnimalStatus,
  doesGroupsIntersect,
  getAnimalDisplayName,
  SearchableAnimal,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  ApplicationLayout,
  Avatar,
  Image,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  Main,
  Placeholder,
  QuickLinkAction,
  Section,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import cn from "classnames";
import * as React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const searchableAnimalItemPlaceholder = (
  <Item>
    <ItemIcon>
      <Placeholder preset="avatar-large" />
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
  [AnimalStatus.ADOPTED]: "bg-green-500",
  [AnimalStatus.DECEASED]: "bg-gray-800",
  [AnimalStatus.FREE]: "bg-gray-800",
  [AnimalStatus.OPEN_TO_ADOPTION]: "bg-blue-500",
  [AnimalStatus.OPEN_TO_RESERVATION]: "bg-blue-500",
  [AnimalStatus.RESERVED]: "bg-yellow-500",
  [AnimalStatus.UNAVAILABLE]: "bg-gray-800",
};

function AnimalLinkItem({ animal }: { animal: SearchableAnimal }) {
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem href={`./${animal.id}`}>
      <ItemIcon className="relative">
        <Avatar>
          <Image image={animal.avatarId} preset="avatar" alt={displayName} />
        </Avatar>

        <span
          className={cn(
            "absolute bottom-0 right-0 inline-flex h-4 w-4 rounded-full border-2 border-white",
            StatusBadgeColors[animal.status]
          )}
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
      <Header
        headerTitle={title}
        action={{ href: "./search", icon: FaSearch }}
      />

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
