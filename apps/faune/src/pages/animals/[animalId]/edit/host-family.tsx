import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import { Button } from "actions/button";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList, renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import { Avatar } from "dataDisplay/avatar";
import {
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "dataDisplay/item";
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
import { SearchInput, useSearch } from "formElements/searchInput";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import { Section } from "layouts/section";
import * as React from "react";
import { FaPlus } from "react-icons/fa";

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

  const { screenSize } = useScreenSize();

  return (
    <>
      <Header>
        <HeaderBackLink href="../situation" />
        <SearchInput
          size={screenSize <= ScreenSize.SMALL ? "small" : "medium"}
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
