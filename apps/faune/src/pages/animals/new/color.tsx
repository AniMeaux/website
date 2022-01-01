import { UserGroup } from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalCreation";
import {
  AnimalColorSearchItem,
  AnimalColorSearchItemPlaceholder,
} from "animalColor/animalColorItems";
import { useAllAnimalColors } from "animalColor/animalColorQueries";
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

const CreateAnimalColorPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllAnimalColors({ search });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (animalColor) => animalColor.id,
    renderPlaceholderItem: () => <AnimalColorSearchItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de couleur",
    emptySearchMessage: "Aucune couleur trouvée",
    renderEmptySearchAction: () => (
      <Button onClick={() => setRawSearch("")}>Effacer la recherche</Button>
    ),
    renderItem: (animalColor) => (
      <AnimalColorSearchItem
        animalColor={animalColor}
        highlight={animalColor.id === formPayload.color?.id}
        onClick={() => {
          setFormPayload((payload) => ({ ...payload, color: animalColor }));
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

CreateAnimalColorPage.WrapperComponent = AnimalFormProvider;

CreateAnimalColorPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalColorPage;
