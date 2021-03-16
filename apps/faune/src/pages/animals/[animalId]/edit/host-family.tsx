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
    <>
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
        <HeaderBackLink href="../situation" />
      </Header>
    ),
    renderEntity: () => <UpdateAnimalHostFamilyForm />,
    renderError: (errorPage) => (
      <>
        <Header>
          <HeaderBackLink href="../situation" />
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
