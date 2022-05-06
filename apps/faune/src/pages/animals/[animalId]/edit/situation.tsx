import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import { AnimalFormProvider, useAnimalForm } from "~/animal/edition";
import {
  AnimalSituationForm,
  AnimalSituationFormPlaceholder,
} from "~/animal/situationForm";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Placeholder } from "~/core/loaders/placeholder";
import { useOperationMutation, useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const UpdateAnimalSituationPage: PageComponent = () => {
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

  const updateAnimalSituation = useOperationMutation("updateAnimalSituation", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getAnimal", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllActiveAnimals" });
      cache.invalidate({ name: "searchAnimals" });
      router.backIfPossible("../..");
    },
  });

  const { situationState, setSituationState } = useAnimalForm();

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  let content: React.ReactNode = null;

  if (getAnimal.state === "success") {
    content = (
      <AnimalSituationForm
        isEdit
        state={situationState}
        setState={setSituationState}
        onSubmit={(value) =>
          updateAnimalSituation.mutate({ ...value, id: getAnimal.result.id })
        }
        pending={updateAnimalSituation.state === "loading"}
        serverErrors={
          updateAnimalSituation.state === "error" ? ["server-error"] : []
        }
      />
    );
  } else {
    content = <AnimalSituationFormPlaceholder />;
  }

  const name =
    getAnimal.state === "success" ? getAnimal.result.officialName : null;

  return (
    <ApplicationLayout>
      <PageTitle title={name} />

      <Header>
        <HeaderBackLink href="../.." />
        <HeaderTitle>{name ?? <Placeholder $preset="text" />}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalSituationPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

UpdateAnimalSituationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalSituationPage;
