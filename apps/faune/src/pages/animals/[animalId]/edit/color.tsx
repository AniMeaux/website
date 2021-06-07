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
  AnimalColorButtonItem,
  AnimalColorItemPlaceholder,
} from "entities/animalColor/animalColorItems";
import { useAllAnimalColors } from "entities/animalColor/animalColorQueries";
import * as React from "react";
import { Button } from "ui/actions/button";
import { SearchInput, useSearch } from "ui/formElements/searchInput";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderBackLink } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Section } from "ui/layouts/section";

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
        <SearchInput size="small" value={rawSearch} onChange={setRawSearch} />
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
    renderError: (error) => (
      <>
        <Header>
          <HeaderBackLink href="../profile" />
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

UpdateAnimalColorPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalColorPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalColorPage;
