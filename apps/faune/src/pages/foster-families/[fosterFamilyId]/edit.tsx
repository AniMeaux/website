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
import {
  FosterFamilyForm,
  FosterFamilyFormPlaceholder,
} from "~/fosterFamily/form";

const FosterFamilyEditPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.fosterFamilyId === "string",
    `The fosterFamilyId path should be a string. Got '${typeof router.query
      .fosterFamilyId}'`
  );

  const getFosterFamily = useOperationQuery({
    name: "getFosterFamily",
    params: { id: router.query.fosterFamilyId },
  });

  const updateFosterFamily = useOperationMutation("updateFosterFamily", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getFosterFamily", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllFosterFamilies" });
      router.backIfPossible("..");
    },
  });

  if (getFosterFamily.state === "error") {
    return <ErrorPage status={getFosterFamily.status} />;
  }

  let content: React.ReactNode = null;

  if (getFosterFamily.state === "success") {
    content = (
      <FosterFamilyForm
        initialFosterFamily={getFosterFamily.result}
        onSubmit={(fosterFamily) =>
          updateFosterFamily.mutate({
            ...fosterFamily,
            id: getFosterFamily.result.id,
          })
        }
        pending={updateFosterFamily.state === "loading"}
        serverErrors={
          updateFosterFamily.state === "error"
            ? [updateFosterFamily.errorResult?.code ?? "server-error"]
            : []
        }
      />
    );
  } else {
    content = <FosterFamilyFormPlaceholder />;
  }

  const name =
    getFosterFamily.state === "success" ? getFosterFamily.result.name : null;

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

FosterFamilyEditPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default FosterFamilyEditPage;
