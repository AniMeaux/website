import { UserGroup } from "@animeaux/shared";
import { AnimalBreedForm } from "~/animal/breed/form";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const CreateAnimalBreedPage: PageComponent = () => {
  const router = useRouter();

  const createAnimalBreed = useOperationMutation("createAnimalBreed", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getAnimalBreed", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllAnimalBreeds" });
      router.backIfPossible("..");
    },
  });

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle race" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvelle race</HeaderTitle>
      </Header>

      <Main>
        <AnimalBreedForm
          onSubmit={(animalBreed) => createAnimalBreed.mutate(animalBreed)}
          pending={createAnimalBreed.state === "loading"}
          serverErrors={
            createAnimalBreed.state === "error"
              ? [createAnimalBreed.errorResult?.code ?? "server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalBreedPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateAnimalBreedPage;
