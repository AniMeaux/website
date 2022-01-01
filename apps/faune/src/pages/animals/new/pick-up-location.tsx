import { UserGroup } from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalCreation";
import { LocationItem, LocationItemPlaceholder } from "animal/animalItems";
import { useSearchLocation } from "animal/queries";
import { SearchInput, useSearch } from "core/formElements/searchInput";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { PageTitle } from "core/pageTitle";
import { renderItemList } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

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

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
      <Header>
        <HeaderBackLink href="../situation" />
        <SearchInput value={rawSearch} onChange={setRawSearch} />
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
