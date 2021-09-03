import { UserGroup } from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalCreation";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import {
  getHostFamilyFormErrors,
  HostFamilyForm,
} from "hostFamily/hostFamilyForm";
import { useCreateHostFamily } from "hostFamily/hostFamilyQueries";
import * as React from "react";

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

      <Header>
        <HeaderBackLink href="../host-family" />
        <HeaderTitle>Nouvelle FA</HeaderTitle>
      </Header>

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
