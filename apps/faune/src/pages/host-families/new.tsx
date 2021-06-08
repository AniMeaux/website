import { UserGroup } from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import {
  getHostFamilyFormErrors,
  HostFamilyForm,
} from "entities/hostFamily/hostFamilyForm";
import { useCreateHostFamily } from "entities/hostFamily/hostFamilyQueries";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import * as React from "react";

const CreateHostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const [createHostFamily, { error, isLoading }] = useCreateHostFamily({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle FA" />

      <Header>
        <HeaderBackLink />
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

CreateHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateHostFamilyPage;
