import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalEdition";
import { useAnimal } from "animal/queries";
import {
  AnimalBreedSearchItem,
  AnimalBreedSearchItemPlaceholder,
} from "animalBreed/animalBreedItems";
import { useAllAnimalBreeds } from "animalBreed/animalBreedQueries";
import { Button } from "core/actions/button";
import { SearchInput, useSearch } from "core/formElements/searchInput";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList, renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

function UpdateAnimalBreedForm() {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllAnimalBreeds({ search, species: formPayload.species });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (animalBreed) => animalBreed.id,
    renderPlaceholderItem: () => <AnimalBreedSearchItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de race",
    emptySearchMessage: "Aucune race trouvée",
    renderEmptySearchAction: () => (
      <Button onClick={() => setRawSearch("")}>Effacer la recherche</Button>
    ),
    renderItem: (animalBreed) => (
      <AnimalBreedSearchItem
        animalBreed={animalBreed}
        highlight={animalBreed.id === formPayload.breed?.id}
        onClick={() => {
          setFormPayload((payload) => ({ ...payload, breed: animalBreed }));
          router.backIfPossible("../profile");
        }}
      />
    ),
  });

  return (
    <>
      <Header>
        <HeaderBackLink href="../profile" />
        <SearchInput value={rawSearch} onChange={setRawSearch} />
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
