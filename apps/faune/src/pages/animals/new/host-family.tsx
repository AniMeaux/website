import {
  HostFamilySearchItem,
  HostFamilySearchItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  useAllHostFamilies,
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

const CreateAnimalHostFamilyPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();
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
    <div>
      <PageTitle title="Nouvel animal" />
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
    </div>
  );
};

CreateAnimalHostFamilyPage.WrapperComponent = AnimalFormProvider;

CreateAnimalHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalHostFamilyPage;
