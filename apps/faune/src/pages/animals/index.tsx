import {
  AnimalActiveBrief,
  doesGroupsIntersect,
  UserGroup,
} from "@animeaux/shared";
import { useCurrentUser } from "account/currentUser";
import { StatusBadge } from "animal/status/badge";
import { StatusIcon } from "animal/status/icon";
import { QuickLinkAction } from "core/actions/quickAction";
import { Avatar, AvatarPlaceholder } from "core/dataDisplay/avatar";
import { EmptyMessage } from "core/dataDisplay/emptyMessage";
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
import { ErrorPage } from "core/layouts/errorPage";
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
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { useOperationQuery } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import { FaPlus, FaSearch } from "react-icons/fa";

const TITLE = "Animaux en charge";

const AnimalListPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const currentUserCanEdit = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  usePageScrollRestoration();

  const getAllActiveAnimals = useOperationQuery({
    name: "getAllActiveAnimals",
  });

  if (getAllActiveAnimals.state === "error") {
    return <ErrorPage status={getAllActiveAnimals.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllActiveAnimals.state === "success") {
    if (getAllActiveAnimals.result.length === 0) {
      content = <EmptyMessage>Il n'y a pas encore d'animaux</EmptyMessage>;
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
