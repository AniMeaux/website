import {
  doesGroupsIntersect,
  getAnimalDisplayName,
  SearchableAnimal,
  UserGroup,
} from "@animeaux/shared-entities";
import { useCurrentUser } from "account/currentUser";
import { useAllActiveAnimals } from "animal/queries";
import { StatusBadge, StatusIcon } from "animal/status";
import { QuickLinkAction } from "core/actions/quickAction";
import { Avatar } from "core/dataDisplay/avatar";
import { AvatarImage } from "core/dataDisplay/image";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "core/dataDisplay/item";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import {
  Header,
  HeaderLink,
  HeaderTitle,
  HeaderUserAvatar,
} from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { usePageScrollRestoration } from "core/layouts/usePageScroll";
import { Placeholder } from "core/loaders/placeholder";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
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

function AnimalItem({ animal }: { animal: SearchableAnimal }) {
  const { screenSize } = useScreenSize();
  const displayName = getAnimalDisplayName(animal);

  return (
    <LinkItem href={`./${animal.id}`}>
      <ItemIcon>
        <Avatar>
          <AvatarImage image={animal.avatarId} alt={displayName} />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{displayName}</ItemMainText>

        {animal.hostFamily != null && (
          <ItemSecondaryText>{animal.hostFamily.name}</ItemSecondaryText>
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

const TITLE = "Animaux en charge";

const AnimalListPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const currentUserCanEdit = doesGroupsIntersect(currentUser.groups, [
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
    renderItem: (animal) => <AnimalItem animal={animal} />,
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
