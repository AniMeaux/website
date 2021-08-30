import { UserGroup } from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { renderItemList } from "core/request";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "entities/animal/animalCreation";
import {
  LocationItem,
  LocationItemPlaceholder,
} from "entities/animal/animalItems";
import { useSearchLocation } from "entities/animal/queries";
import { SearchInput, useSearch } from "formElements/searchInput";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import { Section } from "layouts/section";
import * as React from "react";

const CreatePickUpLocationPage: PageComponent = () => {
  const router = useRouter();
  const { formPayload, setFormPayload } = useAnimalForm();
  const { search, rawSearch, setRawSearch } = useSearch("");

  const query = useSearchLocation({ search });
  const { content } = renderItemList(query, {
    getItemKey: (location) => location.value,
    renderPlaceholderItem: () => <LocationItemPlaceholder />,
    emptyMessage: "",
    renderEmptyMessage: () => null,
    renderAdditionalItem: () => {
      const cleanedSearch = search.trim();

      if (
        cleanedSearch !== "" &&
        query.data?.every(
          (item) => item.value.toLowerCase() !== cleanedSearch.toLowerCase()
        )
      ) {
        return (
          <LocationItem
            location={{
              value: cleanedSearch,
              // Use markdown style bold.
              highlighted: `**${cleanedSearch}**`,
              count: 0,
            }}
            onClick={() => {
              setFormPayload((payload) => ({
                ...payload,
                pickUpLocation: cleanedSearch,
              }));
              router.backIfPossible("../situation");
            }}
          />
        );
      }

      return null;
    },
    renderItem: (location) => (
      <LocationItem
        location={location}
        highlight={location.value === formPayload.pickUpLocation}
        onClick={() => {
          setFormPayload((payload) => ({
            ...payload,
            pickUpLocation: location.value,
          }));
          router.backIfPossible("../situation");
        }}
      />
    ),
  });

  const { screenSize } = useScreenSize();

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
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

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreatePickUpLocationPage.WrapperComponent = AnimalFormProvider;

CreatePickUpLocationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreatePickUpLocationPage;
