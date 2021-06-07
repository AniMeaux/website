import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList, renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "entities/animal/animalEdition";
import { useAnimal } from "entities/animal/queries";
import {
  HostFamilySearchItem,
  HostFamilySearchItemPlaceholder,
} from "entities/hostFamily/hostFamilyItems";
import { useAllHostFamilies } from "entities/hostFamily/hostFamilyQueries";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "ui/actions/button";
import { Avatar } from "ui/dataDisplay/avatar";
import {
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "ui/dataDisplay/item";
import { SearchInput, useSearch } from "ui/formElements/searchInput";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderBackLink } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Section } from "ui/layouts/section";

function UpdateAnimalHostFamilyForm() {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useAllHostFamilies({ search });
  const { content } = renderInfiniteItemList(query, {
    hasSearch: search !== "",
    getItemKey: (hostFamily) => hostFamily.id,
    renderPlaceholderItem: () => <HostFamilySearchItemPlaceholder />,
    emptyMessage: "Il n'y a pas encore de famille d'accueil",
    emptySearchMessage: "Aucune famille d'accueil trouvée",
    renderEmptySearchAction: () => (
      <Button onClick={() => setRawSearch("")}>Effacer la recherche</Button>
    ),
    renderAdditionalItem: () => (
      <LinkItem
        href="../new-host-family"
        style={{
          color: "var(--primary-500)",
          fontWeight: "var(--font-weight-medium)" as any,
        }}
      >
        <ItemIcon>
          <Avatar>
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
        <SearchInput size="small" value={rawSearch} onChange={setRawSearch} />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>
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
    renderError: (error) => (
      <>
        <Header>
          <HeaderBackLink href="../situation" />
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

CreateAnimalHostFamilyPage.WrapperComponent = AnimalFormProvider;

CreateAnimalHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalHostFamilyPage;
