import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import without from "lodash.without";
import {
  AnimalBreedItemPlaceholder,
  AnimalBreedSearchItem,
} from "~/animal/breed/searchItem";
import { AnimalFormProvider, useAnimalForm } from "~/animal/edition";
import { useSearchParams } from "~/core/baseSearchParams";
import { EmptyMessage } from "~/core/dataDisplay/emptyMessage";
import {
  QSearchParams,
  SearchParamsInput,
} from "~/core/formElements/searchParamsInput";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section } from "~/core/layouts/section";
import { Placeholders } from "~/core/loaders/placeholder";
import { useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const UpdateAnimalBreedPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.animalId === "string",
    `The animalId path should be a string. Got '${typeof router.query
      .animalId}'`
  );

  const getAnimal = useOperationQuery({
    name: "getAnimal",
    params: { id: router.query.animalId },
  });

  const { profileState, setProfileState } = useAnimalForm();

  const searchParams = useSearchParams(() => new QSearchParams());
  const searchAnimalBreeds = useOperationQuery({
    name: "searchAnimalBreeds",
    params: {
      search: searchParams.getQ(),
      species: profileState.species ?? undefined,
    },
  });

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  if (searchAnimalBreeds.state === "error") {
    return <ErrorPage status={searchAnimalBreeds.status} />;
  }

  let content: React.ReactNode = null;

  if (getAnimal.state === "success" && searchAnimalBreeds.state === "success") {
    if (searchAnimalBreeds.result.length === 0) {
      content = <EmptyMessage>Aucune race trouvée</EmptyMessage>;
    } else {
      content = (
        <ul>
          {searchAnimalBreeds.result.map((animalBreed) => (
            <li key={animalBreed.id}>
              <AnimalBreedSearchItem
                animalBreed={animalBreed}
                highlight={animalBreed.id === profileState.breed?.id}
                onClick={() => {
                  setProfileState((prevState) => ({
                    ...prevState,
                    breed: animalBreed,
                    errors: without(
                      prevState.errors,
                      "breed-species-missmatch"
                    ),
                  }));

                  router.backIfPossible("../profile");
                }}
              />
            </li>
          ))}
        </ul>
      );
    }
  } else {
    content = (
      <ul>
        <Placeholders count={5}>
          <li>
            <AnimalBreedItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    );
  }

  const name =
    getAnimal.state === "success" ? getAnimal.result.officialName : null;

  return (
    <ApplicationLayout>
      <PageTitle title={name} />
      <Header>
        <HeaderBackLink href="../profile" />
        <SearchParamsInput placeholder="Chercher une race" />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalBreedPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

UpdateAnimalBreedPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalBreedPage;
