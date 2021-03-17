import {
  Header,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalItemPlaceholder,
  SearchableAnimalLinkItem,
  useAllAnimals,
  useCurrentUser,
} from "@animeaux/app-core";
import {
  AnimalStatus,
  doesGroupsIntersect,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  Main,
  QuickLinkAction,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Animaux";

const ANIMAL_STATUS_TO_SHOW = [
  AnimalStatus.OPEN_TO_ADOPTION,
  AnimalStatus.OPEN_TO_RESERVATION,
  AnimalStatus.RESERVED,
  AnimalStatus.UNAVAILABLE,
];

const AnimalListPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  usePageScrollRestoration();

  const query = useAllAnimals({ status: ANIMAL_STATUS_TO_SHOW });
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animal) => animal.id,
    placeholderElement: SearchableAnimalItemPlaceholder,
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
