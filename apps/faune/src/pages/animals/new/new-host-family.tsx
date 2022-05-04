import { UserGroup } from "@animeaux/shared";
import { AnimalFormProvider, useAnimalForm } from "~/animal/creation";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { HostFamilyForm } from "~/hostFamily/form";

const CreateHostFamilyPage: PageComponent = () => {
  const { setSituationState } = useAnimalForm();
  const router = useRouter();

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
