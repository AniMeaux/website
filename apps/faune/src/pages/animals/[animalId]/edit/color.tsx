import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import {
  AnimalColorItemPlaceholder,
  AnimalColorSearchItem,
} from "~/animal/color/searchItems";
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

const UpdateAnimalColorPage: PageComponent = () => {
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
  const searchAnimalColors = useOperationQuery({
    name: "searchAnimalColors",
    params: { search: searchParams.getQ() },
  });

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  if (searchAnimalColors.state === "error") {
    return <ErrorPage status={searchAnimalColors.status} />;
  }

  let content: React.ReactNode;

  if (getAnimal.state === "success" && searchAnimalColors.state === "success") {
    if (searchAnimalColors.result.length === 0) {
      content = <EmptyMessage>Aucune couleur trouvée</EmptyMessage>;
    } else {
      content = (
        <ul>
          {searchAnimalColors.result.map((animalColor) => (
            <li key={animalColor.id}>
              <AnimalColorSearchItem
                animalColor={animalColor}
                highlight={animalColor.id === profileState.color?.id}
                onClick={() => {
                  setProfileState((prevState) => ({
                    ...prevState,
                    color: animalColor,
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
            <AnimalColorItemPlaceholder />
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
        <SearchParamsInput placeholder="Chercher une couleur" />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalColorPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

UpdateAnimalColorPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalColorPage;
