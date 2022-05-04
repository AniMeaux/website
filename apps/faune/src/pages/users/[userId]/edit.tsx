import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import { useCurrentUser } from "~/account/currentUser";
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
import { UserForm, UserFormPlaceholder } from "~/user/form";

const UserEditPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.userId === "string",
    `The userId path should be a string. Got '${typeof router.query.userId}'`
  );

  const { currentUser } = useCurrentUser();

  const getUser = useOperationQuery({
    name: "getUser",
    params: { id: router.query.userId },
  });

  const updateUser = useOperationMutation("updateUser", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getUser", params: { id: response.result.id } },
        response.result
      );

      if (currentUser.id === response.result.id) {
        cache.set({ name: "getCurrentUser" }, response.result);
      }

      cache.invalidate({ name: "getAllUsers" });
      router.backIfPossible("..");
    },
  });

  if (getUser.state === "error") {
    return <ErrorPage status={getUser.status} />;
  }

  let content: React.ReactNode = null;

  if (getUser.state === "success") {
    content = (
      <UserForm
        initialUser={getUser.result}
        onSubmit={({ email, ...user }) =>
          updateUser.mutate({ ...user, id: getUser.result.id })
        }
        pending={updateUser.state === "loading"}
        serverErrors={
          updateUser.state === "error"
            ? [updateUser.errorResult?.code ?? "server-error"]
            : []
        }
      />
    );
  } else {
    content = <UserFormPlaceholder />;
  }

  const displayName =
    getUser.state === "success" ? getUser.result.displayName : null;

  return (
    <ApplicationLayout>
      <PageTitle title={displayName} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>
          {displayName ?? <Placeholder $preset="text" />}
        </HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UserEditPage.authorisedGroups = [UserGroup.ADMIN];

export default UserEditPage;
