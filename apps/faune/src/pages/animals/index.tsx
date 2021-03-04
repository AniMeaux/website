import {
  Header,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalItem,
  SearchableAnimalItemPlaceholder,
  useAllAnimals,
  useCurrentUser,
} from "@animeaux/app-core";
import { doesGroupsIntersect, UserGroup } from "@animeaux/shared-entities";
import {
  Main,
  QuickLinkAction,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Animaux";

const AnimalListPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  usePageScrollRestoration();

  const query = useAllAnimals();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animal) => animal.id,
    placeholderElement: SearchableAnimalItemPlaceholder,
    renderEmptyMessage: () => "Il n'y a pas encore d'animaux",
    renderItem: (animal) => (
      <SearchableAnimalItem animal={animal} href={`./${animal.id}`} />
    ),
  });

  return (
    <div>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

      <Main hasNavigation={isCurrentUserAdmin}>
        {content}

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
