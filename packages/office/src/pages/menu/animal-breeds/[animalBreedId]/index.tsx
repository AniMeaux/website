import {
  AnimalBreed,
  AnimalSpeciesLabels,
  getErrorMessage,
} from "@animeaux/shared-entities";
import { useRouter } from "next/router";
import * as React from "react";
import { FaDna, FaPen } from "react-icons/fa";
import {
  useAnimalBreed,
  useDeleteAnimalBreed,
} from "../../../../core/animalBreed/animalBreedQueries";
import { PageComponent } from "../../../../core/pageComponent";
import { useCurrentUser } from "../../../../core/user/currentUserContext";
import { ButtonWithConfirmation } from "../../../../ui/button";
import { Item, ItemContent, ItemIcon, ItemMainText } from "../../../../ui/item";
import { Aside, AsideLayout } from "../../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../../../ui/layouts/header";
import { PageTitle } from "../../../../ui/layouts/page";
import { Section, SectionTitle } from "../../../../ui/layouts/section";
import { Placeholder } from "../../../../ui/loaders/placeholder";
import { Message } from "../../../../ui/message";
import { PrimaryActionLink } from "../../../../ui/primaryAction";
import { Separator } from "../../../../ui/separator";
import { AnimalBreedsPage } from "../index";

function DetailsSection({ animalBreed }: { animalBreed: AnimalBreed }) {
  return (
    <Section>
      <SectionTitle>Détails</SectionTitle>

      <ul>
        <li>
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
        </li>
      </ul>
    </Section>
  );
}

function DetailsPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <ul>
        <li>
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
        </li>
      </ul>
    </Section>
  );
}

function ActionsSection({ animalBreed }: { animalBreed: AnimalBreed }) {
  const [deleteAnimalBreed, deleteAnimalBreedRequest] = useDeleteAnimalBreed();

  return (
    <Section className="px-4">
      {deleteAnimalBreedRequest.error != null && (
        <Message type="error" className="mb-4">
          {getErrorMessage(deleteAnimalBreedRequest.error)}
        </Message>
      )}

      <ul>
        <li>
          <ButtonWithConfirmation
            confirmationMessage={`Êtes-vous sûr de vouloir supprimer la race ${animalBreed.name} ?`}
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

const AnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const [animalBreed, animalBreedRequest] = useAnimalBreed(animalBreedId);

  const { currentUser } = useCurrentUser();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (animalBreed != null) {
    pageTitle = animalBreed.name;
    headerTitle = animalBreed.name;
  } else if (animalBreedRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (animalBreedRequest.error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (animalBreed != null) {
    body = (
      <>
        <DetailsSection animalBreed={animalBreed} />
        {currentUser.role.resourcePermissions.animal_breed && (
          <>
            <Separator />
            <ActionsSection animalBreed={animalBreed} />

            <PrimaryActionLink href="edit">
              <FaPen />
            </PrimaryActionLink>
          </>
        )}
      </>
    );
  } else if (animalBreedRequest.isLoading) {
    body = (
      <>
        <DetailsPlaceholderSection />
        {currentUser.role.resourcePermissions.animal_breed && (
          <>
            <Separator />
            <ActionsPlaceholderSection />
          </>
        )}
      </>
    );
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>{headerTitle}</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title={pageTitle} />

      <Aside>
        {animalBreedRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(animalBreedRequest.error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

AnimalBreedPage.WrapperComponent = AnimalBreedsPage;

export default AnimalBreedPage;
