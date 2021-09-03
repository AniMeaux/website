import { getAnimalDisplayName, UserGroup } from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalEdition";
import { LocationItem, LocationItemPlaceholder } from "animal/animalItems";
import { useAnimal, useSearchLocation } from "animal/queries";
import { SearchInput, useSearch } from "core/formElements/searchInput";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { PageTitle } from "core/pageTitle";
import { renderItemList, renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { PageComponent } from "core/types";

function UpdatePickUpLocationForm() {
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

const UpdatePickUpLocationPage: PageComponent = () => {
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
    renderEntity: () => <UpdatePickUpLocationForm />,
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

UpdatePickUpLocationPage.WrapperComponent = AnimalFormProvider;

UpdatePickUpLocationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdatePickUpLocationPage;
