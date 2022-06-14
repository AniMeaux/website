import { UserGroup } from "@animeaux/shared";
import { AnimalFormProvider, useAnimalForm } from "~/animal/creation";
import { Link } from "~/core/actions/link";
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
import {
  CreateFosterFamilyItem,
  FosterFamilyItem,
  FosterFamilyItemPlaceholder,
} from "~/fosterFamily/items";

const AnimalFosterFamilyPage: PageComponent = () => {
  const { situationState, setSituationState } = useAnimalForm();
  const router = useRouter();

  const searchParams = useSearchParams(() => new QSearchParams());
  const searchFosterFamilies = useOperationQuery({
    name: "searchFosterFamilies",
    params: { search: searchParams.getQ() },
  });

  if (searchFosterFamilies.state === "error") {
    return <ErrorPage status={searchFosterFamilies.status} />;
  }

  let content: React.ReactNode;

  if (searchFosterFamilies.state === "success") {
    if (searchFosterFamilies.result.length === 0) {
      content = (
        <EmptyMessage
          action={<Link href="../new-foster-family">En créer une</Link>}
        >
          Aucune famille d'accueil trouvée
        </EmptyMessage>
      );
    } else {
      content = (
        <ul>
          <li>
            <CreateFosterFamilyItem />
          </li>

          {searchFosterFamilies.result.map((fosterFamily) => (
            <li key={fosterFamily.id}>
              <FosterFamilyItem
                fosterFamily={fosterFamily}
                highlight={fosterFamily.id === situationState.fosterFamily?.id}
                onClick={() => {
                  setSituationState((prevState) => ({
                    ...prevState,
                    fosterFamily: {
                      id: fosterFamily.id,
                      name: fosterFamily.name,
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
            <FosterFamilyItemPlaceholder />
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
        <SearchParamsInput placeholder="Chercher une famille d'accueil" />
      </Header>

      <Main>
        <Section>{content}</Section>
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

AnimalFosterFamilyPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

AnimalFosterFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default AnimalFosterFamilyPage;
