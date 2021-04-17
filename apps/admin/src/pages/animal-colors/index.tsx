import {
  AnimalColorButtonItem,
  AnimalColorItemPlaceholder,
  Header,
  PageComponent,
  renderInfiniteItemList,
  useAllAnimalColors,
  useDeleteAnimalColor,
} from "@animeaux/app-core";
import { AnimalColor } from "@animeaux/shared-entities";
import {
  ApplicationLayout,
  ButtonItem,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  Modal,
  QuickLinkAction,
  Section,
  useModal,
  usePageScrollRestoration,
  withConfirmation,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaAngleRight, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const TITLE = "Couleurs";

const AnimalColorListPage: PageComponent = () => {
  const [selectedColor, setSelectedColor] = React.useState<AnimalColor | null>(
    null
  );

  usePageScrollRestoration();

  const query = useAllAnimalColors();
  const { content, title } = renderInfiniteItemList(query, {
    title: TITLE,
    getItemKey: (animalColor) => animalColor.id,
    renderPlaceholderItem: () => <AnimalColorItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de couleur",
    renderItem: (animalColor) => (
      <AnimalColorButtonItem
        animalColor={animalColor}
        onClick={() => setSelectedColor(animalColor)}
      />
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={TITLE} />
      <Header headerTitle={title} />

      <Main hasNavigation>
        <Section>{content}</Section>

        <QuickLinkAction href="./new">
          <FaPlus />
        </QuickLinkAction>

        <Modal
          open={selectedColor != null}
          onDismiss={() => setSelectedColor(null)}
        >
          <AnimalColorModalContent animalColor={selectedColor!} />
        </Modal>
      </Main>

      <Navigation />
    </ApplicationLayout>
  );
};

export default AnimalColorListPage;

type AnimalColorProps = {
  animalColor: AnimalColor;
};

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
      color="default"
      // TODO: Prevent delete if it is used by animals.
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
