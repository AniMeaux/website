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
  ButtonLink,
  ButtonSection,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Placeholder,
  QuickActions,
  Section,
  SectionTitle,
  useRouter,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPen } from "react-icons/fa";
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

  return (
    <ButtonWithConfirmation
      confirmationMessage={[
        `Êtes-vous sûr de vouloir supprimer la race ${animalBreed.name} ?`,
        "L'action est irréversible.",
      ].join("\n")}
      onClick={() => deleteAnimalBreed(animalBreed.id)}
      // TODO: Prevent delete if it is used by animals.
      color="red"
    >
      Supprimer
    </ButtonWithConfirmation>
  );
}

const AnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const query = useAnimalBreed(animalBreedId);

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animalBreed) => animalBreed.name,
    renderPlaceholder: () => <DetailsPlaceholderSection />,
    renderEntity: (animalBreed) => <DetailsSection animalBreed={animalBreed} />,
  });

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />

      <Main>
        {content}

        {query.data != null && (
          <QuickActions icon={FaPen}>
            <ButtonSection>
              <ButtonLink href="./edit" variant="outlined">
                Modifier
              </ButtonLink>

              <DeleteAnimalBreedButton animalBreed={query.data} />
            </ButtonSection>
          </QuickActions>
        )}
      </Main>
    </div>
  );
};

export default AnimalBreedPage;
