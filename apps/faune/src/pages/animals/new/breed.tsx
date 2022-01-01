import { UserGroup } from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalCreation";
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
import { renderInfiniteItemList } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

const CreateAnimalBreedPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();
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
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
      <Header>
        <HeaderBackLink href="../profile" />
        <SearchInput value={rawSearch} onChange={setRawSearch} />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalBreedPage.WrapperComponent = AnimalFormProvider;

CreateAnimalBreedPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalBreedPage;
