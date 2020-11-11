import {
  AnimalBreed,
  AnimalSpeciesLabels,
  getErrorMessage,
  PaginatedResponse,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { useAllAnimalBreeds } from "../../../core/animalBreed/animalBreedQueries";
import { ResourceIcon } from "../../../core/resource";
import { useCurrentUser } from "../../../core/user/currentUserContext";
import { Avatar } from "../../../ui/avatar";
import { Button } from "../../../ui/button";
import { EmptyMessage } from "../../../ui/emptyMessage";
import { SearchInput } from "../../../ui/formElements/searchInput";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "../../../ui/item";
import { Header, HeaderCurrentUserAvatar } from "../../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../../ui/layouts/page";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";

type AnimalBreedItemProps = {
  animalBreed: AnimalBreed;
  active?: boolean;
};

function AnimalBreedItem({ animalBreed, active }: AnimalBreedItemProps) {
  return (
    <LinkItem
      size="large"
      href={
        active ? "/menu/animal-breeds" : `/menu/animal-breeds/${animalBreed.id}`
      }
      active={active}
    >
      <ItemIcon>
        <Avatar>
          <ResourceIcon resourceKey="animal_breed" />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{animalBreed.name}</ItemMainText>

        <ItemSecondaryText>
          {AnimalSpeciesLabels[animalBreed.species]}
        </ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

type AnimalBreedsRowsProps = {
  search: string;
  animalBreedsPages: PaginatedResponse<AnimalBreed>[];
  activeAnimalBreedId: string | null;
};

function AnimalBreedsRows({
  search,
  animalBreedsPages,
  activeAnimalBreedId,
}: AnimalBreedsRowsProps) {
  // There is allways at least one page.
  if (animalBreedsPages[0].hits.length === 0) {
    return (
      <li>
        <EmptyMessage>
          {search === ""
            ? "Il n'y a pas encore de race."
            : "Aucune race trouvée."}
        </EmptyMessage>
      </li>
    );
  }

  const children: React.ReactNode[] = [];

  animalBreedsPages.forEach((page) => {
    page.hits.forEach((animalBreed) => {
      children.push(
        <li key={animalBreed.id}>
          <AnimalBreedItem
            animalBreed={animalBreed}
            active={activeAnimalBreedId === animalBreed.id}
          />
        </li>
      );
    });
  });

  return <>{children}</>;
}

function LoadingRows() {
  return (
    <Placeholders count={5}>
      <li>
        <Item size="large">
          <ItemIcon>
            <Placeholder preset="avatar" />
          </ItemIcon>

          <ItemContent>
            <Placeholder preset="label" />
            <Placeholder preset="text" className="text-xs" />
          </ItemContent>
        </Item>
      </li>
    </Placeholders>
  );
}

type AnimalBreedsPageProps = {
  children?: React.ReactNode;
};

export default AnimalBreedsPage;
export function AnimalBreedsPage({ children }: AnimalBreedsPageProps) {
  const router = useRouter();
  const activeAnimalBreedId: string | null =
    (router.query.animalBreedId as string) ?? null;

  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.animal_breed;

  const [search, setSearch] = React.useState("");
  const [animalBreedsPages, animalBreedsPagesRequest] = useAllAnimalBreeds({
    search,
  });

  let body: React.ReactNode | null = null;
  if (animalBreedsPages != null) {
    body = (
      <AnimalBreedsRows
        search={search}
        animalBreedsPages={animalBreedsPages}
        activeAnimalBreedId={activeAnimalBreedId}
      />
    );
  } else if (animalBreedsPagesRequest.isLoading) {
    body = <LoadingRows />;
  }

  return (
    <PageLayout
      header={
        <Header>
          <SearchInput
            onSearch={setSearch}
            placeholder="Chercher une race"
            className="mr-2 flex-1"
          />

          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Races animales" />

      <Main className="px-2">
        {animalBreedsPagesRequest.error != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(animalBreedsPagesRequest.error)}
          </Message>
        )}

        <ul>{body}</ul>

        {animalBreedsPagesRequest.canFetchMore && (
          <Button onClick={() => animalBreedsPagesRequest.fetchMore()}>
            En afficher plus
          </Button>
        )}

        {canEdit && (
          <PrimaryActionLink href="./new">
            <FaPlus />
          </PrimaryActionLink>
        )}
      </Main>

      {children}
    </PageLayout>
  );
}
