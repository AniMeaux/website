import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
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
import { HostFamilyForm, HostFamilyFormPlaceholder } from "~/hostFamily/form";

const HostFamilyEditPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.hostFamilyId === "string",
    `The hostFamilyId path should be a string. Got '${typeof router.query
      .hostFamilyId}'`
  );

  const getHostFamily = useOperationQuery({
    name: "getHostFamily",
    params: { id: router.query.hostFamilyId },
  });

  const updateHostFamily = useOperationMutation("updateHostFamily", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getHostFamily", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllHostFamilies" });
      router.backIfPossible("..");
    },
  });

  if (getHostFamily.state === "error") {
    return <ErrorPage status={getHostFamily.status} />;
  }

  let content: React.ReactNode = null;

  if (getHostFamily.state === "success") {
    content = (
      <HostFamilyForm
        initialHostFamily={getHostFamily.result}
        onSubmit={(hostFamily) =>
          updateHostFamily.mutate({
            ...hostFamily,
            id: getHostFamily.result.id,
          })
        }
        pending={updateHostFamily.state === "loading"}
        serverErrors={
          updateHostFamily.state === "error"
            ? [updateHostFamily.errorResult?.code ?? "server-error"]
            : []
        }
      />
    );
  } else {
    content = <HostFamilyFormPlaceholder />;
  }

  const name =
    getHostFamily.state === "success" ? getHostFamily.result.name : null;

  return (
    <ApplicationLayout>
      <PageTitle title={name} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{name ?? <Placeholder $preset="text" />}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

HostFamilyEditPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default HostFamilyEditPage;
