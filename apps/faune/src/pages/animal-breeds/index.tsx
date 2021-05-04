import {
  AnimalBreed,
  AnimalSpeciesLabels,
  UserGroup,
} from "@animeaux/shared-entities";
import { Header } from "core/header";
import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { useRouter } from "core/router";
import {
  useAllAnimalBreeds,
  useDeleteAnimalBreed,
} from "entities/animalBreed/animalBreedQueries";
import type { Placement } from "popper.js";
import * as React from "react";
import {
  FaAngleRight,
  FaDna,
  FaEllipsisH,
  FaPen,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Button } from "ui/actions/button";
import { QuickLinkAction } from "ui/actions/quickAction";
import { Avatar } from "ui/dataDisplay/avatar";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "ui/dataDisplay/item";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";
import { Section } from "ui/layouts/section";
import { usePageScrollRestoration } from "ui/layouts/usePageScroll";
import { Placeholder } from "ui/loaders/placeholder";
import { Modal, useModal } from "ui/popovers/modal";
import { ScreenSize, useScreenSize } from "ui/screenSize";
import { withConfirmation } from "ui/withConfirmation";

function AnimalBreedItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset="avatar" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>

        <ItemSecondaryText>
          <Placeholder preset="text" />
        </ItemSecondaryText>
      </ItemContent>
    </Item>
  );
}

type AnimalBreedProps = {
  animalBreed: AnimalBreed;
};

function DeleteAnimalBreedButton({ animalBreed }: AnimalBreedProps) {
  const router = useRouter();
  const { onDismiss } = useModal();
  const [deleteAnimalBreed] = useDeleteAnimalBreed({
    onSuccess() {
      onDismiss();
      router.backIfPossible("..");
    },
  });

  const confirmationMessage = [
    `Êtes-vous sûr de vouloir supprimer ${animalBreed.name} ?`,
    "L'action est irréversible.",
  ].join("\n");

  return (
    <ButtonItem
      onClick={withConfirmation(confirmationMessage, () => {
        deleteAnimalBreed(animalBreed.id);
      })}
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

      <hr className="mx-4 border-t border-gray-100" />

      <Section>
        <DeleteAnimalBreedButton animalBreed={animalBreed} />
      </Section>
    </>
  );
}

export function AnimalBreedItem({ animalBreed }: AnimalBreedProps) {
  const { screenSize } = useScreenSize();
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const referenceElement = React.useRef<HTMLButtonElement>(null!);

  let item: React.ReactNode;
  let modalPlacement: Placement = "bottom";

  if (screenSize <= ScreenSize.SMALL) {
    item = (
      <ButtonItem ref={referenceElement} onClick={() => setIsMenuVisible(true)}>
        <ItemIcon>
          <Avatar>
            <FaDna />
          </Avatar>
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{animalBreed.name}</ItemMainText>
          <ItemSecondaryText>
            {AnimalSpeciesLabels[animalBreed.species]}
          </ItemSecondaryText>
        </ItemContent>
      </ButtonItem>
    );
  } else {
    modalPlacement = "bottom-end";
    item = (
      <Item>
        <ItemIcon>
          <Avatar>
            <FaDna />
          </Avatar>
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{animalBreed.name}</ItemMainText>
          <ItemSecondaryText>
            {AnimalSpeciesLabels[animalBreed.species]}
          </ItemSecondaryText>
        </ItemContent>

        <ItemIcon>
          <Button
            iconOnly
            ref={referenceElement}
            onClick={() => setIsMenuVisible(true)}
          >
            <FaEllipsisH />
          </Button>
        </ItemIcon>
      </Item>
    );
  }

  return (
    <>
      {item}

      <Modal
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={referenceElement}
        placement={modalPlacement}
      >
        <AnimalBreedModalContent animalBreed={animalBreed} />
      </Modal>
    </>
  );
}

const TITLE = "Races";

const AnimalBreedListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllAnimalBreeds();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animalBreed) => animalBreed.id,
    renderPlaceholderItem: () => <AnimalBreedItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de race",
    renderItem: (animalBreed) => <AnimalBreedItem animalBreed={animalBreed} />,
  });

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

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
