import {
  getHostFamilyFormErrors,
  Header,
  HostFamilyForm,
  PageComponent,
  useCreateHostFamily,
} from "@animeaux/app-core";
import { UserGroup } from "@animeaux/shared-entities";
import { Main, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "../../../core/animalCreation";
import { PageTitle } from "../../../core/pageTitle";

const CreateHostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const { setFormPayload } = useAnimalForm();
  const [createHostFamily, { error, isLoading }] = useCreateHostFamily({
    onSuccess(hostFamily) {
      setFormPayload((payload) => ({ ...payload, hostFamily }));
      router.push(resolveUrl(router.asPath, "../situation?restoreScroll"));
    },
  });

  return (
    <div>
      <PageTitle title="Nouvelle FA" />
      <Header headerTitle="Nouvelle FA" canGoBack backHref="../host-family" />

      <Main>
        <HostFamilyForm
          onSubmit={createHostFamily}
          pending={isLoading}
          errors={getHostFamilyFormErrors(error)}
        />
      </Main>
    </div>
  );
};

CreateHostFamilyPage.WrapperComponent = AnimalFormProvider;

CreateHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateHostFamilyPage;
