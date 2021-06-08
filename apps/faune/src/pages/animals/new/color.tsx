import { UserGroup } from "@animeaux/shared-entities";
import { Button } from "actions/button";
import { PageTitle } from "core/pageTitle";
import { renderInfiniteItemList } from "core/request";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "entities/animal/animalCreation";
import {
  AnimalColorButtonItem,
  AnimalColorItemPlaceholder,
} from "entities/animalColor/animalColorItems";
import { useAllAnimalColors } from "entities/animalColor/animalColorQueries";
import { SearchInput, useSearch } from "formElements/searchInput";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import { Section } from "layouts/section";
import * as React from "react";

const CreateAnimalColorPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();
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

  const { screenSize } = useScreenSize();

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
      <Header>
        <HeaderBackLink href="../profile" />
        <SearchInput
          size={screenSize <= ScreenSize.SMALL ? "small" : "medium"}
          value={rawSearch}
          onChange={setRawSearch}
        />
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
