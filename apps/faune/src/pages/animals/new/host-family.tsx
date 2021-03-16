import {
  HostFamilySearchItem,
  HostFamilySearchItemPlaceholder,
  PageComponent,
  renderInfiniteItemList,
  useAllHostFamilies,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import {
  Avatar,
  Button,
  Header,
  HeaderBackLink,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  SearchInput,
  useRouter,
  useSearch,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
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
    emptyMessage: "Il n'y a pas encore de famille d'accueil",
    emptySearchMessage: "Aucune famille d'accueil trouvée",
    renderEmptySearchAction: () => (
      <Button variant="outlined" onClick={() => setRawSearch("")}>
        Effacer la recherche
      </Button>
    ),
    renderAdditionalItem: () => (
      <LinkItem href="../new-host-family" className="font-medium text-blue-500">
        <ItemIcon>
          <Avatar size="medium" color="blue">
            <FaPlus />
          </Avatar>
        </ItemIcon>

        <ItemContent>
          <ItemMainText>Créer une FA</ItemMainText>
        </ItemContent>
      </LinkItem>
    ),
    renderItem: (hostFamily) => (
      <HostFamilySearchItem
        hostFamily={hostFamily}
        highlight={hostFamily.id === formPayload.hostFamily?.id}
        onClick={() => {
          setFormPayload((payload) => ({ ...payload, hostFamily }));
          router.backIfPossible("../situation");
        }}
      />
    ),
  });

  return (
    <div>
      <PageTitle title="Nouvel animal" />
      <Header>
        <HeaderBackLink href="../situation" />

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
