import { AnimalBreed, UserGroup } from "@animeaux/shared";
import { useRef, useState } from "react";
import { FaAngleRight, FaDna, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { ANIMAL_SPECIES_LABELS } from "~/animal/species/labels";
import { QuickLinkAction } from "~/core/actions/quickAction";
import { Avatar, AvatarPlaceholder } from "~/core/dataDisplay/avatar";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderTitle, HeaderUserAvatar } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section } from "~/core/layouts/section";
import { Separator } from "~/core/layouts/separator";
import { usePageScrollRestoration } from "~/core/layouts/usePageScroll";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { useOperationMutation, useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { Modal, useModal } from "~/core/popovers/modal";
import { showSnackbar, Snackbar } from "~/core/popovers/snackbar";
import { PageComponent } from "~/core/types";

const TITLE = "Races";

const AnimalBreedListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllAnimalBreeds = useOperationQuery(
    { name: "getAllAnimalBreeds" },
    {
      onSuccess: (response, cache) => {
        response.result.forEach((animalBreed) => {
          cache.set(
            { name: "getAnimalBreed", params: { id: animalBreed.id } },
            animalBreed
          );
        });
      },
    }
  );

  if (getAllAnimalBreeds.state === "error") {
    return <ErrorPage status={getAllAnimalBreeds.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllAnimalBreeds.state === "success") {
    if (getAllAnimalBreeds.result.length === 0) {
      content = <EmptyMessage>Il n'y a pas encore de race</EmptyMessage>;
    } else {
      content = (
        <ul>
          {getAllAnimalBreeds.result.map((animalBreed) => (
            <li key={animalBreed.id}>
              <AnimalBreedItem animalBreed={animalBreed} />
            </li>
          ))}
        </ul>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <AnimalBreedItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>
          {TITLE}{" "}
          {getAllAnimalBreeds.state === "success" &&
            `(${getAllAnimalBreeds.result.length})`}
        </HeaderTitle>
      </Header>

      <Main>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>
      </Main>

      <Navigation />
    </ApplicationLayout>
  );
};

AnimalBreedListPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalBreedListPage;

function AnimalBreedItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <AvatarPlaceholder />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder $preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

type AnimalBreedProps = {
  animalBreed: AnimalBreed;
};

export function AnimalBreedItem({ animalBreed }: AnimalBreedProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const referenceElement = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <ButtonItem ref={referenceElement} onClick={() => setIsMenuVisible(true)}>
        <ItemIcon>
          <Avatar>
            <FaDna />
          </Avatar>
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{animalBreed.name}</ItemMainText>
          <ItemSecondaryText>
            {ANIMAL_SPECIES_LABELS[animalBreed.species]}
          </ItemSecondaryText>
        </ItemContent>
      </ButtonItem>

      <Modal
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={referenceElement}
        placement="bottom-start"
      >
        <AnimalBreedModalContent animalBreed={animalBreed} />
      </Modal>
    </>
  );
}

function AnimalBreedModalContent({ animalBreed }: AnimalBreedProps) {
  const { onDismiss } = useModal();

  return (
    <>
      <Section>
        <LinkItem href={`./${animalBreed.id}/edit`} onClick={onDismiss}>
          <ItemIcon>
            <FaPen />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>
      </Section>

      <Separator />

      <Section>
        <DeleteAnimalBreedButton animalBreed={animalBreed} />
      </Section>
    </>
  );
}

function DeleteAnimalBreedButton({ animalBreed }: AnimalBreedProps) {
  const { onDismiss } = useModal();

  const deleteAnimalBreed = useOperationMutation("deleteAnimalBreed", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getAnimalBreed",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllAnimalBreeds" });
      onDismiss();
    },
    onError: () => {
      showSnackbar.error(
        <Snackbar>
          La couleur {animalBreed.name} n'a pas pu être supprimée
        </Snackbar>
      );
    },
  });

  return (
    <ButtonItem
      onClick={() => {
        if (deleteAnimalBreed.state !== "loading") {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${animalBreed.name} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteAnimalBreed.mutate({ id: animalBreed.id });
          }
        }
      }}
      color="red"
    >
      <ItemIcon>
        <FaTrash />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Supprimer</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}
