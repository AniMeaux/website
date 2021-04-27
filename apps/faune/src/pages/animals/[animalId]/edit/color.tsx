import {
  AnimalColorButtonItem,
  AnimalColorItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  renderQueryEntity,
  useAllAnimalColors,
  useAnimal,
} from "@animeaux/app-core";
import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import {
  ApplicationLayout,
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
import { Navigation } from "../../../../core/navigation";
import { PageTitle } from "../../../../core/pageTitle";

function UpdateAnimalColorForm() {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllAnimalColors({ search });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (animalColor) => animalColor.id,
    renderPlaceholderItem: () => <AnimalColorItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de couleur",
    emptySearchMessage: "Aucune couleur trouvée",
    renderEmptySearchAction: () => (
      <Button onClick={() => setRawSearch("")}>Effacer la recherche</Button>
    ),
    renderItem: (animalColor) => (
      <AnimalColorButtonItem
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

const UpdateAnimalColorPage: PageComponent = () => {
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
    renderEntity: () => <UpdateAnimalColorForm />,
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
    <ApplicationLayout>
      <PageTitle title={pageTitle} />
      {content}
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalColorPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalColorPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalColorPage;
