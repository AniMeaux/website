import {
  AnimalSpeciesIcon,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimalBreed,
  useDeleteAnimalBreed,
} from "@animeaux/app-core";
import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import {
  ButtonItem,
  HeaderTitle,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  ModalHeader,
  Placeholder,
  QuickActions,
  Section,
  SectionTitle,
  useRouter,
  withConfirmation,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaAngleRight, FaPen, FaTrash } from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

type AnimalBreedProps = {
  animalBreed: AnimalBreed;
};

function DetailsSection({ animalBreed }: AnimalBreedProps) {
  return (
    <Section>
      <SectionTitle>Détails</SectionTitle>

      <Item>
        <ItemIcon>
          <AnimalSpeciesIcon species={animalBreed.species} />
        </ItemIcon>

        <ItemContent>
          <ItemMainText>
            {AnimalSpeciesLabels[animalBreed.species]}
          </ItemMainText>
        </ItemContent>
      </Item>
    </Section>
  );
}

function DetailsPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <Item>
        <ItemIcon>
          <Placeholder preset="icon" />
        </ItemIcon>

        <ItemContent>
          <ItemMainText>
            <Placeholder preset="label" />
          </ItemMainText>
        </ItemContent>
      </Item>
    </Section>
  );
}

function DeleteAnimalBreedButton({ animalBreed }: AnimalBreedProps) {
  const router = useRouter();
  const [deleteAnimalBreed] = useDeleteAnimalBreed({
    onSuccess() {
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
      className="text-red-500 font-medium"
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

const AnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const query = useAnimalBreed(animalBreedId);

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animalBreed) => animalBreed.name,
    renderPlaceholder: () => <DetailsPlaceholderSection />,
    renderEntity: (animalBreed) => (
      <>
        <DetailsSection animalBreed={animalBreed} />

        <QuickActions icon={FaPen}>
          <ModalHeader>
            <HeaderTitle>{animalBreed.name}</HeaderTitle>
          </ModalHeader>

          <Section>
            <LinkItem href="./edit">
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

          <hr className="mx-4 my-1 border-t border-gray-100" />

          <Section>
            <DeleteAnimalBreedButton animalBreed={animalBreed} />
          </Section>
        </QuickActions>
      </>
    ),
  });

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />

      <Main>{content}</Main>
    </div>
  );
};

export default AnimalBreedPage;
