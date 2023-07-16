import { AnimalColor, UserGroup } from "@animeaux/shared";
import { useRef, useState } from "react";
import {
  FaAngleRight,
  FaPalette,
  FaPen,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { QuickLinkAction } from "~/core/actions/quickAction";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
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
import { Snackbar, showSnackbar } from "~/core/popovers/snackbar";
import { PageComponent } from "~/core/types";

const TITLE = "Couleurs";

const AnimalColorListPage: PageComponent = () => {
  usePageScrollRestoration();

  const getAllAnimalColors = useOperationQuery(
    { name: "getAllAnimalColors" },
    {
      onSuccess: (response, cache) => {
        response.result.forEach((animalColor) => {
          cache.set(
            { name: "getAnimalColor", params: { id: animalColor.id } },
            animalColor
          );
        });
      },
    }
  );

  if (getAllAnimalColors.state === "error") {
    return <ErrorPage status={getAllAnimalColors.status} />;
  }

  let content: React.ReactNode = null;

  if (getAllAnimalColors.state === "success") {
    if (getAllAnimalColors.result.length === 0) {
      content = <EmptyMessage>Il n'y a pas encore de couleur</EmptyMessage>;
    } else {
      content = (
        <ul>
          {getAllAnimalColors.result.map((animalColor) => (
            <li key={animalColor.id}>
              <AnimalColorItem animalColor={animalColor} />
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
            <AnimalColorItemPlaceholder />
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
          {getAllAnimalColors.state === "success" &&
            `(${getAllAnimalColors.result.length})`}
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

AnimalColorListPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalColorListPage;

function AnimalColorItemPlaceholder() {
  return (
    <Item>
      <ItemIcon>
        <Placeholder $preset="icon" />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          <Placeholder $preset="label" />
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

type AnimalColorProps = {
  animalColor: AnimalColor;
};

function AnimalColorItem({ animalColor }: AnimalColorProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const referenceElement = useRef<HTMLButtonElement>(null!);

  return (
    <>
      <ButtonItem ref={referenceElement} onClick={() => setIsMenuVisible(true)}>
        <ItemIcon>
          <FaPalette />
        </ItemIcon>

        <ItemContent>
          <ItemMainText>{animalColor.name}</ItemMainText>
        </ItemContent>
      </ButtonItem>

      <Modal
        open={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        referenceElement={referenceElement}
        placement="bottom-start"
      >
        <AnimalColorModalContent animalColor={animalColor} />
      </Modal>
    </>
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

function DeleteAnimalColorButton({ animalColor }: AnimalColorProps) {
  const { onDismiss } = useModal();

  const deleteAnimalColor = useOperationMutation("deleteAnimalColor", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getAnimalColor",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllAnimalColors" });
      onDismiss();
    },
    onError: () => {
      showSnackbar.error(
        <Snackbar>
          La couleur {animalColor.name} n'a pas pu être supprimée
        </Snackbar>
      );
    },
  });

  return (
    <ButtonItem
      onClick={() => {
        if (deleteAnimalColor.state !== "loading") {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${animalColor.name} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteAnimalColor.mutate({ id: animalColor.id });
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
