import { useAnimalBreed, useDeleteAnimalBreed } from "@animeaux/app-core";
import {
  AnimalBreed,
  AnimalSpeciesLabels,
  getErrorMessage,
} from "@animeaux/shared-entities";
import {
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Message,
  Placeholder,
  resolveUrl,
  Section,
  SectionTitle,
  Separator,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaDna, FaPen } from "react-icons/fa";
import { Header } from "../../../core/header";
import { Navigation } from "../../../core/navigation";
import { PageTitle } from "../../../core/pageTitle";

function DetailsSection({ animalBreed }: { animalBreed: AnimalBreed }) {
  return (
    <Section>
      <SectionTitle>Détails</SectionTitle>

      <Item>
        <ItemIcon>
          <FaDna />
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
  const [deleteAnimalBreed, deleteAnimalBreedRequest] = useDeleteAnimalBreed(
    () => {
      router.push(resolveUrl(router.asPath, "..?deleteSucceeded"));
    }
  );

  return (
    <Section className="px-4">
      {deleteAnimalBreedRequest.error != null && (
        <Message type="error" className="mb-4">
          {getErrorMessage(deleteAnimalBreedRequest.error)}
        </Message>
      )}

      <ul className="space-y-4">
        <li>
          <ButtonWithConfirmation
            confirmationMessage={[
              `Êtes-vous sûr de vouloir supprimer la race ${animalBreed.name} ?`,
              "L'action est irréversible.",
            ].join("\n")}
            onClick={() => deleteAnimalBreed(animalBreed.id)}
            // TODO: Prevent delete if it is used by animals.
            color="red"
            className="w-full"
          >
            Supprimer
          </ButtonWithConfirmation>
        </li>
      </ul>
    </Section>
  );
}

function ActionsPlaceholderSection() {
  return (
    <Section className="px-4">
      <ul>
        <li>
          <Placeholder preset="input" />
        </li>
      </ul>
    </Section>
  );
}

export default function AnimalBreedPage() {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const updateSucceeded = router.query.updateSucceeded != null;
  const [animalBreed, animalBreedRequest] = useAnimalBreed(animalBreedId);

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (animalBreed != null) {
    pageTitle = animalBreed.name;
    headerTitle = animalBreed.name;
  } else if (animalBreedRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (animalBreedRequest.error != null) {
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
  } else if (animalBreedRequest.isLoading) {
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

      <Main>
        {updateSucceeded && (
          <Message type="success" className="mx-4 mb-4">
            La race a bien été modifiée
          </Message>
        )}

        {animalBreedRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(animalBreedRequest.error)}
          </Message>
        )}

        {content}
      </Main>

      <Navigation hideOnSmallScreen />
    </div>
  );
}
