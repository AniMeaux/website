import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  Header,
  PageComponent,
  useCreateAnimalBreed,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { ApplicationLayout, Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import { Navigation } from "../../core/navigation";
import { PageTitle } from "../../core/pageTitle";

const CreateAnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const [createAnimalBreed, { error, isLoading }] = useCreateAnimalBreed({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

  const formErrors: AnimalBreedFormErrors = {};

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.ANIMAL_BREED_MISSING_NAME)) {
      formErrors.name = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.ANIMAL_BREED_MISSING_SPECIES)) {
      formErrors.species = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle race" />
      <Header headerTitle="Nouvelle race" canGoBack />

      <Main>
        <AnimalBreedForm
          onSubmit={createAnimalBreed}
          pending={isLoading}
          errors={formErrors}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalBreedPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateAnimalBreedPage;
