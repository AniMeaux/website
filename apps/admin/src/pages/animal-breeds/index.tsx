import {
  AnimalBreedItem,
  AnimalBreedItemPlaceholder,
  Header,
  useAllAnimalBreeds,
} from "@animeaux/app-core";
import { AnimalBreed, PaginatedResponse } from "@animeaux/shared-entities";
import {
  Button,
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
};

function AnimalBreedsRows({ animalBreedsPages }: AnimalBreedsRowsProps) {
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
      <ul>{children}</ul>
    </Section>
  );
}

export default function AnimalBreedListPage() {
  const [animalBreedsPages, query] = useAllAnimalBreeds();

  let content: React.ReactNode | null = null;
  let animalBreedsCount: string = "";

  if (animalBreedsPages != null) {
    // There is allways at least one page.
    animalBreedsCount = `(${animalBreedsPages.pages[0].hitsTotalCount})`;
    content = <AnimalBreedsRows animalBreedsPages={animalBreedsPages.pages} />;
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

      <Main hasNavigation>
        {content}

        {query.hasNextPage && (
          <Section>
            <Button
              onClick={() => query.fetchNextPage()}
              variant="outlined"
              className="mx-auto"
            >
              En afficher plus
            </Button>
          </Section>
        )}
      </Main>

      <Navigation />
    </div>
  );
}
