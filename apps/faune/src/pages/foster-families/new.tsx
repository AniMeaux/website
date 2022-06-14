import { UserGroup } from "@animeaux/shared";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { FosterFamilyForm } from "~/fosterFamily/form";

const CreateFosterFamilyPage: PageComponent = () => {
  const router = useRouter();

  const createFosterFamily = useOperationMutation("createFosterFamily", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getFosterFamily", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllFosterFamilies" });
      router.backIfPossible("..");
    },
  });

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle FA" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvelle FA</HeaderTitle>
      </Header>

      <Main>
        <FosterFamilyForm
          onSubmit={(fosterFamily) => createFosterFamily.mutate(fosterFamily)}
          pending={createFosterFamily.state === "loading"}
          serverErrors={
            createFosterFamily.state === "error"
              ? [createFosterFamily.errorResult?.code ?? "server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateFosterFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateFosterFamilyPage;
