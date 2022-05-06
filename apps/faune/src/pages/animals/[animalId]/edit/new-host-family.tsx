import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import { AnimalFormProvider, useAnimalForm } from "~/animal/edition";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation, useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { HostFamilyForm } from "~/hostFamily/form";

const CreateHostFamilyPage: PageComponent = () => {
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

  const { setSituationState } = useAnimalForm();

  const createHostFamily = useOperationMutation("createHostFamily", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getHostFamily", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllHostFamilies" });

      setSituationState((prevState) => ({
        ...prevState,
        hostFamily: { id: response.result.id, name: response.result.name },
      }));

      router.backIfPossible("../situation", { historyOffset: 2 });
    },
  });

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle FA" />

      <Header>
        <HeaderBackLink href="../host-family" />
        <HeaderTitle>Nouvelle FA</HeaderTitle>
      </Header>

      <Main>
        <HostFamilyForm
          onSubmit={(hostFamily) => createHostFamily.mutate(hostFamily)}
          pending={createHostFamily.state === "loading"}
          serverErrors={
            createHostFamily.state === "error"
              ? [createHostFamily.errorResult?.code ?? "server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateHostFamilyPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

CreateHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateHostFamilyPage;
