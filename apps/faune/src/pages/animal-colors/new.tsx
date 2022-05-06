import { UserGroup } from "@animeaux/shared";
import { AnimalColorForm } from "~/animal/color/form";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { useOperationMutation } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const CreateAnimalColorPage: PageComponent = () => {
  const router = useRouter();

  const createAnimalColor = useOperationMutation("createAnimalColor", {
    onSuccess: (response, cache) => {
      cache.set(
        { name: "getAnimalColor", params: { id: response.result.id } },
        response.result
      );

      cache.invalidate({ name: "getAllAnimalColors" });
      router.backIfPossible("..");
    },
  });

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle couleur" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvelle couleur</HeaderTitle>
      </Header>

      <Main>
        <AnimalColorForm
          onSubmit={(animalColor) => createAnimalColor.mutate(animalColor)}
          pending={createAnimalColor.state === "loading"}
          serverErrors={
            createAnimalColor.state === "error"
              ? [createAnimalColor.errorResult?.code ?? "server-error"]
              : []
          }
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalColorPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateAnimalColorPage;
