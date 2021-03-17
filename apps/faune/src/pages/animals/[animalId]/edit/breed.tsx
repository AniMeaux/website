import {
  AnimalBreedSearchItem,
  AnimalBreedSearchItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  renderQueryEntity,
  useAllAnimalBreeds,
  useAnimal,
} from "@animeaux/app-core";
import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import {
  Button,
  Header,
  HeaderBackLink,
  Main,
  SearchInput,
  Section,
  useRouter,
  useSearch,
} from "@animeaux/ui-library";
import * as React from "react";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "../../../../core/animalEdition";
import { PageTitle } from "../../../../core/pageTitle";

function UpdateAnimalBreedForm() {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllAnimalBreeds({ search, species: formPayload.species });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (animalBreed) => animalBreed.id,
    placeholderElement: AnimalBreedSearchItemPlaceholder,
    emptyMessage: "Il n'y a pas encore de race",
    emptySearchMessage: "Aucune race trouvée",
    renderEmptySearchAction: () => (
      <Button variant="outlined" onClick={() => setRawSearch("")}>
        Effacer la recherche
      </Button>
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

        <SearchInput
          size="small"
          className="flex-1"
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
    renderError: (errorPage) => (
      <>
        <Header>
          <HeaderBackLink href="../profile" />
        </Header>

        <Main>{errorPage}</Main>
      </>
    ),
  });

  return (
    <div>
      <PageTitle title={pageTitle} />
      {content}
    </div>
  );
};

UpdateAnimalBreedPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalBreedPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalBreedPage;
