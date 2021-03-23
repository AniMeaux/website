import {
  AnimalBreedLinkItem,
  AnimalBreedItemPlaceholder,
  Header,
  PageComponent,
  renderInfiniteItemList,
  useAllAnimalBreeds,
} from "@animeaux/app-core";
import {
  Main,
  QuickLinkAction,
  Section,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Races";

const AnimalBreedListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllAnimalBreeds();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animalBreed) => animalBreed.id,
    renderPlaceholderItem: () => <AnimalBreedItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de race",
    renderItem: (animalBreed) => (
      <AnimalBreedLinkItem
        animalBreed={animalBreed}
        href={`./${animalBreed.id}`}
      />
    ),
  });

  return (
    <div>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

      <Main hasNavigation>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>
      <Navigation />
    </div>
  );
};

export default AnimalBreedListPage;
