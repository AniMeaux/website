import { UserGroup } from "@animeaux/shared-entities";
import { Header } from "core/header";
import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "entities/animal/animalCreation";
import {
  getHostFamilyFormErrors,
  HostFamilyForm,
} from "entities/hostFamily/hostFamilyForm";
import { useCreateHostFamily } from "entities/hostFamily/hostFamilyQueries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";

const CreateHostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const { setFormPayload } = useAnimalForm();
  const [createHostFamily, { error, isLoading }] = useCreateHostFamily({
    onSuccess(hostFamily) {
      setFormPayload((payload) => ({ ...payload, hostFamily }));
      router.backIfPossible("../situation");
    },
  });

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle FA" />
      <Header headerTitle="Nouvelle FA" canGoBack backHref="../host-family" />

      <Main>
        <HostFamilyForm
          onSubmit={createHostFamily}
          pending={isLoading}
          errors={getHostFamilyFormErrors(error)}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateHostFamilyPage.WrapperComponent = AnimalFormProvider;

CreateHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateHostFamilyPage;
