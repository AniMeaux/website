import { UserGroup } from "@animeaux/shared";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { useOperationMutation } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { UserForm } from "user/form";

const CreateUserPage: PageComponent = () => {
  const router = useRouter();

  const createUser = useOperationMutation("createUser", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getUser", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllUsers" });
      router.backIfPossible("..");
    },
  });

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel utilisateur" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvel utilisateur</HeaderTitle>
      </Header>

      <Main>
        <UserForm
          onSubmit={(user) => createUser.mutate(user)}
          pending={createUser.state === "loading"}
          serverErrors={
            createUser.state === "error"
              ? [createUser.errorResult?.code ?? "server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateUserPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateUserPage;
