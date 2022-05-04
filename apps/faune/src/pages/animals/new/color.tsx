import { UserGroup } from "@animeaux/shared";
import {
  AnimalColorItemPlaceholder,
  AnimalColorSearchItem,
} from "~/animal/color/searchItems";
import { AnimalFormProvider, useAnimalForm } from "~/animal/creation";
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

const CreateAnimalColorPage: PageComponent = () => {
  const { profileState, setProfileState } = useAnimalForm();
  const router = useRouter();

  const searchParams = useSearchParams(() => new QSearchParams());
  const searchAnimalColors = useOperationQuery({
    name: "searchAnimalColors",
    params: { search: searchParams.getQ() },
  });

  if (searchAnimalColors.state === "error") {
    return <ErrorPage status={searchAnimalColors.status} />;
  }

  let content: React.ReactNode;

  if (searchAnimalColors.state === "success") {
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

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
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

CreateAnimalColorPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

CreateAnimalColorPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalColorPage;
