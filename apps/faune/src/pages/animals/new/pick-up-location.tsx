import { UserGroup } from "@animeaux/shared";
import { AnimalFormProvider, useAnimalForm } from "animal/creation";
import { FormState } from "animal/formState";
import {
  AddLocationItem,
  LocationItem,
  LocationItemPlaceholder,
} from "animal/locationItem";
import { useSearchParams } from "core/baseSearchParams";
import {
  QSearchParams,
  SearchParamsInput,
} from "core/formElements/searchParamsInput";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { ErrorPage } from "core/layouts/errorPage";
import { Header, HeaderBackLink } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section } from "core/layouts/section";
import { Placeholders } from "core/loaders/placeholder";
import { useOperationQuery } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent, SetStateAction } from "core/types";
import without from "lodash.without";

const CreatePickUpLocationPage: PageComponent = () => {
  const { situationState, setSituationState } = useAnimalForm();
  const router = useRouter();

  const searchParams = useSearchParams(() => new QSearchParams());
  const searchLocation = useOperationQuery({
    name: "searchLocation",
    params: { search: searchParams.getQ() },
  });

  if (searchLocation.state === "error") {
    return <ErrorPage status={searchLocation.status} />;
  }

  let content: React.ReactNode;

  if (searchLocation.state === "success") {
    const cleanedSearch = searchParams.getQ().trim();
    const normalizedSearch = cleanedSearch.toLowerCase();
    let additionalItem: React.ReactNode;
    if (
      cleanedSearch !== "" &&
      searchLocation.result.every(
        (location) => location.value.toLowerCase() !== normalizedSearch
      )
    ) {
      additionalItem = (
        <li>
          <AddLocationItem
            search={cleanedSearch}
            highlight={cleanedSearch === situationState.pickUpLocation}
            onClick={() => {
              setSituationState(setPickUpLocation(cleanedSearch));
              router.backIfPossible("../situation");
            }}
          />
        </li>
      );
    }

    content = (
      <ul>
        {additionalItem}
        {searchLocation.result.map((location) => (
          <li key={location.value}>
            <LocationItem
              location={location}
              highlight={location.value === situationState.pickUpLocation}
              onClick={() => {
                setSituationState(setPickUpLocation(location.value));
                router.backIfPossible("../situation");
              }}
            />
          </li>
        ))}
      </ul>
    );
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <LocationItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
      <Header>
        <HeaderBackLink href="../situation" />
        <SearchParamsInput placeholder="Chercher un lieux" />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreatePickUpLocationPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

CreatePickUpLocationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreatePickUpLocationPage;

function setPickUpLocation(
  location: string
): SetStateAction<FormState["situationState"]> {
  return (prevState) => ({
    ...prevState,
    pickUpLocation: location,
    errors: without(prevState.errors, "empty-pick-up-location"),
  });
}
