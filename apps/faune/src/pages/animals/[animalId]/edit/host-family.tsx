import { UserGroup } from "@animeaux/shared";
import { AnimalFormProvider, useAnimalForm } from "animal/edition";
import { Link } from "core/actions/link";
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
import {
  CreateHostFamilyItem,
  HostFamilyItem,
  HostFamilyItemPlaceholder,
} from "hostFamily/items";
import invariant from "invariant";

const AnimalHostFamilyPage: PageComponent = () => {
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
  const searchHostFamilies = useOperationQuery({
    name: "searchHostFamilies",
    params: { search: searchParams.getQ() },
  });

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  if (searchHostFamilies.state === "error") {
    return <ErrorPage status={searchHostFamilies.status} />;
  }

  let content: React.ReactNode;

  if (getAnimal.state === "success" && searchHostFamilies.state === "success") {
    if (searchHostFamilies.result.length === 0) {
      content = (
        <EmptyMessage
          action={<Link href="../new-host-family">En créer une</Link>}
        >
          Aucune famille d'accueil trouvée
        </EmptyMessage>
      );
    } else {
      content = (
        <ul>
          <li>
            <CreateHostFamilyItem />
          </li>

          {searchHostFamilies.result.map((hostFamily) => (
            <li key={hostFamily.id}>
              <HostFamilyItem
                hostFamily={hostFamily}
                highlight={hostFamily.id === situationState.hostFamily?.id}
                onClick={() => {
                  setSituationState((prevState) => ({
                    ...prevState,
                    hostFamily: { id: hostFamily.id, name: hostFamily.name },
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
            <HostFamilyItemPlaceholder />
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
        <SearchParamsInput placeholder="Chercher une famille d'accueil" />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

AnimalHostFamilyPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

AnimalHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default AnimalHostFamilyPage;
