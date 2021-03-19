import {
  Header,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalItemPlaceholder,
  SearchableAnimalLinkItem,
  useAllActiveAnimals,
  useCurrentUser,
} from "@animeaux/app-core";
import { doesGroupsIntersect, UserGroup } from "@animeaux/shared-entities";
import {
  Main,
  QuickLinkAction,
  Section,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

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
    renderPlaceholderItem: () => <SearchableAnimalItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore d'animaux",
    renderItem: (animal) => (
      <SearchableAnimalLinkItem animal={animal} href={`./${animal.id}`} />
    ),
  });

  return (
    <div>
      <PageTitle title={TITLE} />
      <Header
        headerTitle={title}
        action={{ href: "./search", icon: FaSearch }}
      />

      <Main hasNavigation={isCurrentUserAdmin}>
        <Section>{content}</Section>

        {isCurrentUserAdmin && (
          <QuickLinkAction href="./new/profile">
            <FaPlus />
          </QuickLinkAction>
        )}
      </Main>

      {isCurrentUserAdmin && <Navigation />}
    </div>
  );
};

export default AnimalListPage;
