import {
  AnimalBreed,
  AnimalSpeciesLabels,
  getErrorMessage,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { useAllAnimalBreeds } from "../../../core/animalBreed/animalBreedQueries";
import { ResourceIcon } from "../../../core/resource";
import { ScreenSize, useScreenSize } from "../../../core/screenSize";
import { useCurrentUser } from "../../../core/user/currentUserContext";
import { Avatar } from "../../../ui/avatar";
import { EmptyMessage } from "../../../ui/emptyMessage";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "../../../ui/item";
import {
  Header,
  HeaderBackLink,
  HeaderCurrentUserAvatar,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../../ui/layouts/header";
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
  animalBreeds: AnimalBreed[];
  activeAnimalBreedId: string | null;
};

function AnimalBreedsRows({
  animalBreeds,
  activeAnimalBreedId,
}: AnimalBreedsRowsProps) {
  if (animalBreeds.length === 0) {
    return (
      <li>
        <EmptyMessage>Il n'y a pas encore de race.</EmptyMessage>
      </li>
    );
  }

  return (
    <>
      {animalBreeds.map((animalBreed) => (
        <li key={animalBreed.id}>
          <AnimalBreedItem
            animalBreed={animalBreed}
            active={activeAnimalBreedId === animalBreed.id}
          />
        </li>
      ))}
    </>
  );
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

  const { screenSize } = useScreenSize();
  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.animal_breed;
  const [animalBreeds, animalBreedsRequest] = useAllAnimalBreeds();

  let body: React.ReactNode | null = null;
  if (animalBreeds != null) {
    body = (
      <AnimalBreedsRows
        animalBreeds={animalBreeds}
        activeAnimalBreedId={activeAnimalBreedId}
      />
    );
  } else if (animalBreedsRequest.isLoading) {
    body = <LoadingRows />;
  }

  return (
    <PageLayout
      header={
        <Header>
          {screenSize === ScreenSize.SMALL ? (
            <HeaderBackLink href=".." />
          ) : (
            <HeaderPlaceholder />
          )}

          <HeaderTitle>Races animales</HeaderTitle>
          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Races animales" />

      <Main className="px-2">
        {animalBreedsRequest.error != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(animalBreedsRequest.error)}
          </Message>
        )}

        <ul>{body}</ul>

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
