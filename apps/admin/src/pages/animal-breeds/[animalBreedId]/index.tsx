import {
  AnimalSpeciesIcon,
  Header,
  useAnimalBreed,
  useDeleteAnimalBreed,
} from "@animeaux/app-core";
import { AnimalBreed, AnimalSpeciesLabels } from "@animeaux/shared-entities";
import {
  ActionSection,
  ActionSectionList,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Placeholder,
  resolveUrl,
  Section,
  SectionTitle,
  Separator,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPen } from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

function DetailsSection({ animalBreed }: { animalBreed: AnimalBreed }) {
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

function ActionsSection({ animalBreed }: { animalBreed: AnimalBreed }) {
  const router = useRouter();
  const [deleteAnimalBreed] = useDeleteAnimalBreed({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  return (
    <ActionSection>
      <ActionSectionList>
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
      </ActionSectionList>
    </ActionSection>
  );
}

function ActionsPlaceholderSection() {
  return (
    <ActionSection>
      <ActionSectionList>
        <Placeholder preset="button" />
      </ActionSectionList>
    </ActionSection>
  );
}

export default function AnimalBreedPage() {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const [animalBreed, { error, isLoading }] = useAnimalBreed(animalBreedId);

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (animalBreed != null) {
    pageTitle = animalBreed.name;
    headerTitle = animalBreed.name;
  } else if (isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  let content: React.ReactNode | null = null;

  if (animalBreed != null) {
    content = (
      <>
        <DetailsSection animalBreed={animalBreed} />
        <Separator />
        <ActionsSection animalBreed={animalBreed} />
      </>
    );
  } else if (isLoading) {
    content = (
      <>
        <DetailsPlaceholderSection />
        <Separator />
        <ActionsPlaceholderSection />
      </>
    );
  }

  return (
    <div>
      <PageTitle title={pageTitle} />

      <Header
        headerTitle={headerTitle}
        canGoBack
        action={
          animalBreed == null
            ? undefined
            : {
                href: "./edit",
                icon: FaPen,
                label: "Modifier",
              }
        }
      />

      <Main>{content}</Main>
    </div>
  );
}
