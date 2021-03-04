import {
  HostFamilySearchItem,
  HostFamilySearchItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  renderQueryEntity,
  useAllHostFamilies,
  useAnimal,
} from "@animeaux/app-core";
import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
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
} from "../../../../core/animalEdition";
import { PageTitle } from "../../../../core/pageTitle";

function UpdateAnimalHostFamilyForm() {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllHostFamilies({ search });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (hostFamily) => hostFamily.id,
    placeholderElement: HostFamilySearchItemPlaceholder,
    renderEmptyMessage: () => "Il n'y a pas encore de famille d'accueil.",
    renderEmptySearchMessage: () => "Aucune famille d'accueil trouvée.",
    renderEmptySearchAction: () => (
      <Button variant="outlined" onClick={() => setRawSearch("")}>
        Effacer la recherche
      </Button>
    ),
    renderItem: (hostFamily) => (
      <HostFamilySearchItem
        hostFamily={hostFamily}
        highlight={hostFamily.id === formPayload.hostFamily?.id}
        onClick={() => {
          setFormPayload((payload) => ({ ...payload, hostFamily }));
          router.push(resolveUrl(router.asPath, "../situation?restoreScroll"));
        }}
      />
    ),
  });

  return (
    <>
      <Header>
        <HeaderBackLink href="../situation?restoreScroll" />

        <SearchInput
          size="small"
          className="flex-1"
          value={rawSearch}
          onChange={setRawSearch}
        />
      </Header>

      <Main>{content}</Main>
    </>
  );
}

const CreateAnimalHostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);

  const { pageTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animal) => getAnimalDisplayName(animal),
    renderPlaceholder: () => (
      <Header>
        <HeaderBackLink href="../situation?restoreScroll" />
      </Header>
    ),
    renderEntity: () => <UpdateAnimalHostFamilyForm />,
    renderError: (errorPage) => (
      <>
        <Header>
          <HeaderBackLink href="../situation?restoreScroll" />
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

CreateAnimalHostFamilyPage.WrapperComponent = AnimalFormProvider;

CreateAnimalHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalHostFamilyPage;
