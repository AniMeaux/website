import {
  Header,
  PageComponent,
  renderInfiniteItemList,
  useAllAnimalColors,
  useDeleteAnimalColor,
} from "@animeaux/app-core";
import { AnimalColor } from "@animeaux/shared-entities";
import {
  ApplicationLayout,
  Avatar,
  Button,
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  Modal,
  Placeholder,
  QuickLinkAction,
  ScreenSize,
  Section,
  useModal,
  usePageScrollRestoration,
  useScreenSize,
  withConfirmation,
} from "@animeaux/ui-library";
import type { Placement } from "popper.js";
import * as React from "react";
import {
  FaAngleRight,
  FaEllipsisH,
  FaPalette,
  FaPen,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

function AnimalColorItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder preset="avatar" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

type AnimalColorProps = {
  animalColor: AnimalColor;
};

function DeleteAnimalColorButton({ animalColor }: AnimalColorProps) {
  const { onDismiss } = useModal();
  const [deleteAnimalColor] = useDeleteAnimalColor({
    onSuccess() {
      onDismiss();
    },
  });

  const confirmationMessage = [
    `Êtes-vous sûr de vouloir supprimer ${animalColor.name} ?`,
    "L'action est irréversible.",
  ].join("\n");

  return (
    <ButtonItem
      onClick={withConfirmation(confirmationMessage, () => {
        deleteAnimalColor(animalColor.id);
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

function AnimalColorModalContent({ animalColor }: AnimalColorProps) {
  const { onDismiss } = useModal();

  return (
    <>
      <Section>
        <LinkItem href={`./${animalColor.id}/edit`} onClick={onDismiss}>
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
        <DeleteAnimalColorButton animalColor={animalColor} />
      </Section>
    </>
  );
}

function AnimalColorItem({ animalColor }: AnimalColorProps) {
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
            <FaPalette />
          </Avatar>
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{animalColor.name}</ItemMainText>
        </ItemContent>
      </ButtonItem>
    );
  } else {
    modalPlacement = "bottom-end";
    item = (
      <Item>
        <ItemIcon>
          <Avatar>
            <FaPalette />
          </Avatar>
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{animalColor.name}</ItemMainText>
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
        <AnimalColorModalContent animalColor={animalColor} />
      </Modal>
    </>
  );
}

const TITLE = "Couleurs";

const AnimalColorListPage: PageComponent = () => {
  usePageScrollRestoration();

  const query = useAllAnimalColors();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animalColor) => animalColor.id,
    renderPlaceholderItem: () => <AnimalColorItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de couleur",
    renderItem: (animalColor) => <AnimalColorItem animalColor={animalColor} />,
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

export default AnimalColorListPage;
