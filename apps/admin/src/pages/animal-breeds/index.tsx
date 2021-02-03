import {
  AnimalBreedItem,
  AnimalBreedItemPlaceholder,
  Header,
  PageComponent,
  useAllAnimalBreeds,
} from "@animeaux/app-core";
import { AnimalBreed, PaginatedResponse } from "@animeaux/shared-entities";
import {
  EmptyMessage,
  Main,
  Placeholders,
  Section,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

function LoadingRows() {
  return (
    <Section>
      <ul>
        <Placeholders count={5}>
          <li>
            <AnimalBreedItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

type AnimalBreedsRowsProps = {
  animalBreedsPages: PaginatedResponse<AnimalBreed>[];
  hasNextPage: boolean;
};

function AnimalBreedsRows({
  animalBreedsPages,
  hasNextPage,
}: AnimalBreedsRowsProps) {
  // There is allways at least one page.
  if (animalBreedsPages[0].hits.length === 0) {
    return <EmptyMessage>Il n'y a pas encore de race.</EmptyMessage>;
  }

  const children: React.ReactNode[] = [];

  animalBreedsPages.forEach((page) => {
    page.hits.forEach((animalBreed) => {
      children.push(
        <li key={animalBreed.id}>
          <AnimalBreedItem
            animalBreed={animalBreed}
            href={`./${animalBreed.id}`}
          />
        </li>
      );
    });
  });

  return (
    <Section>
      <ul>
        {children}

        {hasNextPage && (
          <li>
            <AnimalBreedItemPlaceholder />
          </li>
        )}
      </ul>
    </Section>
  );
}

const AnimalBreedListPage: PageComponent = () => {
  const [animalBreedsPages, query] = useAllAnimalBreeds();

  let content: React.ReactNode | null = null;
  let animalBreedsCount: string = "";

  if (animalBreedsPages != null) {
    // There is allways at least one page.
    animalBreedsCount = `(${animalBreedsPages.pages[0].hitsTotalCount})`;
    content = (
      <AnimalBreedsRows
        animalBreedsPages={animalBreedsPages.pages}
        // Use `hasNextPage` instead of `isFetchingNextPage` to avoid changing
        // the page height during a scroll when the placeholder is rendered.
        // This is ok because the placeholder will only be visible when the
        // scroll is in a fetch more position.
        hasNextPage={query.hasNextPage ?? false}
      />
    );
  } else if (query.isLoading) {
    content = <LoadingRows />;
  }

  return (
    <div>
      <PageTitle title="Races" />

      <Header
        headerTitle={`Races ${animalBreedsCount}`}
        action={{
          href: "./new",
          icon: FaPlus,
          label: "Créer une race",
        }}
      />

      <Main hasNavigation>{content}</Main>
      <Navigation />
    </div>
  );
};

export default AnimalBreedListPage;
