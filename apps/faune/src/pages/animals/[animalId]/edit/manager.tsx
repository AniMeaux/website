import { UserGroup } from "@animeaux/shared";
import { AnimalFormProvider, useAnimalForm } from "animal/edition";
import { useSearchParams } from "core/baseSearchParams";
import { EmptyMessage } from "core/dataDisplay/emptyMessage";
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
import { PageComponent } from "core/types";
import invariant from "invariant";
import { ManagerItem, ManagerItemPlaceholder } from "user/items";

const AnimalManagerPage: PageComponent = () => {
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

  const { situationState, setSituationState } = useAnimalForm();

  const searchParams = useSearchParams(() => new QSearchParams());
  const searchManager = useOperationQuery({
    name: "searchManager",
    params: { search: searchParams.getQ() },
  });

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  if (searchManager.state === "error") {
    return <ErrorPage status={searchManager.status} />;
  }

  let content: React.ReactNode;

  if (getAnimal.state === "success" && searchManager.state === "success") {
    if (searchManager.result.length === 0) {
      content = <EmptyMessage>Aucun responsable trouvé</EmptyMessage>;
    } else {
      content = (
        <ul>
          {searchManager.result.map((manager) => (
            <li key={manager.id}>
              <ManagerItem
                manager={manager}
                highlight={manager.id === situationState.manager?.id}
                onClick={() => {
                  setSituationState((prevState) => ({
                    ...prevState,
                    manager: {
                      id: manager.id,
                      displayName: manager.displayName,
                    },
                  }));

                  router.backIfPossible("../situation");
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
            <ManagerItemPlaceholder />
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
        <HeaderBackLink href="../situation" />
        <SearchParamsInput placeholder="Chercher un responsable" />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

AnimalManagerPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

AnimalManagerPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default AnimalManagerPage;
