import { UserGroup } from "@animeaux/shared";
import { AnimalColorForm, AnimalColorFormPlaceholder } from "animal/color/form";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { ErrorPage } from "core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Placeholder } from "core/loaders/placeholder";
import { useOperationMutation, useOperationQuery } from "core/operations";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import invariant from "invariant";

const AnimalColorEditPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.animalColorId === "string",
    `The animalColorId path should be a string. Got '${typeof router.query
      .animalColorId}'`
  );

  const getAnimalColor = useOperationQuery({
    name: "getAnimalColor",
    params: { id: router.query.animalColorId },
  });

  const updateAnimalColor = useOperationMutation("updateAnimalColor", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getAnimalColor", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllAnimalColors" });
      router.backIfPossible("../..");
    },
  });

  if (getAnimalColor.state === "error") {
    return <ErrorPage status={getAnimalColor.status} />;
  }

  let content: React.ReactNode = null;

  if (getAnimalColor.state === "success") {
    content = (
      <AnimalColorForm
        initialAnimalColor={getAnimalColor.result}
        onSubmit={(animalColor) =>
          updateAnimalColor.mutate({
            ...animalColor,
            id: getAnimalColor.result.id,
          })
        }
        pending={updateAnimalColor.state === "loading"}
        serverErrors={
          updateAnimalColor.state === "error"
            ? [updateAnimalColor.errorResult?.code ?? "server-error"]
            : []
        }
      />
    );
  } else {
    content = <AnimalColorFormPlaceholder />;
  }

  const name =
    getAnimalColor.state === "success" ? getAnimalColor.result.name : null;

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

AnimalColorEditPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalColorEditPage;
