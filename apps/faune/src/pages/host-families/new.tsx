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
import { PageTitle } from "../../core/pageTitle";

const CreateHostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const [createHostFamily, { error, isLoading }] = useCreateHostFamily({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  return (
    <div>
      <PageTitle title="Nouvelle FA" />
      <Header headerTitle="Nouvelle FA" canGoBack />

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

CreateHostFamilyPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateHostFamilyPage;
