import {
  Header,
  PageComponent,
  renderInfiniteItemList,
  SearchableAnimalItem,
  SearchableAnimalItemPlaceholder,
  useAllAnimals,
} from "@animeaux/app-core";
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

      <Main hasNavigation>
        {content}

        <QuickLinkAction href="./new/profile">
          <FaPlus />
        </QuickLinkAction>
      </Main>

      <Navigation />
    </div>
  );
};

export default AnimalListPage;
