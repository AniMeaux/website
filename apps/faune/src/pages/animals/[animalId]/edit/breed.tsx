import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import { Button } from "actions/button";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList, renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "entities/animal/animalEdition";
import { useAnimal } from "entities/animal/queries";
import {
  AnimalBreedButtonItem,
  AnimalBreedItemPlaceholder,
} from "entities/animalBreed/animalBreedItems";
import { useAllAnimalBreeds } from "entities/animalBreed/animalBreedQueries";
import { SearchInput, useSearch } from "formElements/searchInput";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import { Section } from "layouts/section";
import * as React from "react";

function UpdateAnimalBreedForm() {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllAnimalBreeds({ search, species: formPayload.species });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (animalBreed) => animalBreed.id,
    renderPlaceholderItem: () => <AnimalBreedItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de race",
    emptySearchMessage: "Aucune race trouvée",
    renderEmptySearchAction: () => (
      <Button onClick={() => setRawSearch("")}>Effacer la recherche</Button>
    ),
    renderItem: (animalBreed) => (
      <AnimalBreedButtonItem
        animalBreed={animalBreed}
        highlight={animalBreed.id === formPayload.breed?.id}
        onClick={() => {
          setFormPayload((payload) => ({ ...payload, breed: animalBreed }));
          router.backIfPossible("../profile");
        }}
      />
    ),
  });

  const { screenSize } = useScreenSize();

  return (
    <>
      <Header>
        <HeaderBackLink href="../profile" />
        <SearchInput
          size={screenSize <= ScreenSize.SMALL ? "small" : "medium"}
          value={rawSearch}
          onChange={setRawSearch}
        />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>
    </>
  );
}

const UpdateAnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);

  const { pageTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animal) => getAnimalDisplayName(animal),
    renderPlaceholder: () => (
      <Header>
        <HeaderBackLink href="../profile" />
      </Header>
    ),
    renderEntity: () => <UpdateAnimalBreedForm />,
    renderError: (error) => (
      <>
        <Header>
          <HeaderBackLink href="../profile" />
        </Header>

        <Main>{error}</Main>
      </>
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />
      {content}
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalBreedPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalBreedPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalBreedPage;
