import {
  AnimalBreedSearchItem,
  AnimalBreedSearchItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  useAllAnimalBreeds,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import {
  Button,
  Header,
  HeaderBackLink,
  Main,
  resolveUrl,
  SearchInput,
  useSearch,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "../../../core/animalCreation";
import { PageTitle } from "../../../core/pageTitle";

const CreateAnimalBreedPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllAnimalBreeds({ search, species: formPayload.species });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (animalBreed) => animalBreed.id,
    placeholderElement: AnimalBreedSearchItemPlaceholder,
    renderEmptyMessage: () => "Il n'y a pas encore de race.",
    renderEmptySearchMessage: () => "Aucune race trouvée.",
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
          router.push(resolveUrl(router.asPath, "../profile?restoreScroll"));
        }}
      />
    ),
  });

  return (
    <div>
      <PageTitle title="Nouvel animal" />
      <Header>
        <HeaderBackLink href="../profile?restoreScroll" />

        <SearchInput
          size="small"
          className="flex-1"
          value={rawSearch}
          onChange={setRawSearch}
        />
      </Header>

      <Main>{content}</Main>
    </div>
  );
};

CreateAnimalBreedPage.WrapperComponent = AnimalFormProvider;

CreateAnimalBreedPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalBreedPage;
