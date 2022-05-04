import { UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import {
  AnimalBreedForm,
  AnimalBreedFormPlaceholder,
} from "~/animal/breed/form";
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

const AnimalBreedEditPage: PageComponent = () => {
  const router = useRouter();

  invariant(
    typeof router.query.animalBreedId === "string",
    `The animalBreedId path should be a string. Got '${typeof router.query
      .animalBreedId}'`
  );

  const getAnimalBreed = useOperationQuery({
    name: "getAnimalBreed",
    params: { id: router.query.animalBreedId },
  });

  const updateAnimalBreed = useOperationMutation("updateAnimalBreed", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getAnimalBreed", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllAnimalBreeds" });
      router.backIfPossible("../..");
    },
  });

  if (getAnimalBreed.state === "error") {
    return <ErrorPage status={getAnimalBreed.status} />;
  }

  let content: React.ReactNode = null;

  if (getAnimalBreed.state === "success") {
    content = (
      <AnimalBreedForm
        initialAnimalBreed={getAnimalBreed.result}
        onSubmit={(animalBreed) =>
          updateAnimalBreed.mutate({
            ...animalBreed,
            id: getAnimalBreed.result.id,
          })
        }
        pending={updateAnimalBreed.state === "loading"}
        serverErrors={
          updateAnimalBreed.state === "error"
            ? [updateAnimalBreed.errorResult?.code ?? "server-error"]
            : []
        }
      />
    );
  } else {
    content = <AnimalBreedFormPlaceholder />;
  }

  const name =
    getAnimalBreed.state === "success" ? getAnimalBreed.result.name : null;

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

AnimalBreedEditPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalBreedEditPage;
