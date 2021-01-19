import {
  AnimalBreedItem,
  AnimalBreedItemPlaceholder,
  PageTitle,
  useAllAnimalBreeds,
  useCurrentUser,
} from "@animeaux/app-core";
import {
  AnimalBreed,
  getErrorMessage,
  PaginatedResponse,
} from "@animeaux/shared-entities";
import {
  Button,
  EmptyMessage,
  Header,
  HeaderLink,
  HeaderTitle,
  Main,
  Message,
  Placeholders,
  UserAvatar,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Navigation } from "../../core/navigation";

function LoadingRows() {
  return (
    <ul className="px-2">
      <Placeholders count={5}>
        <li>
          <AnimalBreedItemPlaceholder />
        </li>
      </Placeholders>
    </ul>
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

  return <ul className="px-2">{children}</ul>;
}

export default function AnimalBreedListPage() {
  const router = useRouter();
  const deleteSucceeded = router.query.deleteSucceeded != null;
  const creationSucceeded = router.query.creationSucceeded != null;

  const { currentUser } = useCurrentUser();
  const [animalBreedsPages, animalBreedsPagesRequest] = useAllAnimalBreeds();

  let content: React.ReactNode | null = null;
  let animalBreedsCount: React.ReactNode | null = null;

  if (animalBreedsPages != null) {
    // There is allways at least one page.
    animalBreedsCount = `(${animalBreedsPages[0].hitsTotalCount})`;
    content = <AnimalBreedsRows animalBreedsPages={animalBreedsPages} />;
  } else if (animalBreedsPagesRequest.isLoading) {
    content = <LoadingRows />;
  }

  return (
    <div>
      <PageTitle title="Races animales" />

      <Header>
        <UserAvatar user={currentUser} />
        <HeaderTitle>Races animales {animalBreedsCount}</HeaderTitle>

        <HeaderLink href="./new">
          <FaPlus />
        </HeaderLink>
      </Header>

      <Main hasNavigation>
        {animalBreedsPagesRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(animalBreedsPagesRequest.error)}
          </Message>
        )}

        {deleteSucceeded && (
          <Message type="success" className="mx-4 mb-4">
            La race à bien été supprimée
          </Message>
        )}

        {creationSucceeded && (
          <Message type="success" className="mx-4 mb-4">
            La race à bien été créé
          </Message>
        )}

        {content}

        {animalBreedsPagesRequest.canFetchMore && (
          <Button
            onClick={() => animalBreedsPagesRequest.fetchMore()}
            variant="outlined"
            className="mx-auto mt-4"
          >
            En afficher plus
          </Button>
        )}
      </Main>

      <Navigation />
    </div>
  );
}
