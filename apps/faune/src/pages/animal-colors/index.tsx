import { AnimalColor } from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { PageComponent } from "core/types";
import {
  useAllAnimalColors,
  useDeleteAnimalColor,
} from "entities/animalColor/animalColorQueries";
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
import { Button } from "ui/actions/button";
import { QuickLinkAction } from "ui/actions/quickAction";
import { Avatar } from "ui/dataDisplay/avatar";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "ui/dataDisplay/item";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderTitle, HeaderUserAvatar } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Navigation } from "ui/layouts/navigation";
import { Section } from "ui/layouts/section";
import { Separator } from "ui/layouts/separator";
import { usePageScrollRestoration } from "ui/layouts/usePageScroll";
import { Placeholder } from "ui/loaders/placeholder";
import { Modal, useModal } from "ui/popovers/modal";
import { ScreenSize, useScreenSize } from "ui/screenSize";
import { withConfirmation } from "ui/withConfirmation";

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

      <Separator />

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

      <Header>
        <HeaderUserAvatar />
        <HeaderTitle>{title}</HeaderTitle>
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

export default AnimalColorListPage;
