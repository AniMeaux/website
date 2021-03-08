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
} from "@animeaux/shared-entities";
import { Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
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
    <div>
      <PageTitle title="Nouvelle race" />
      <Header headerTitle="Nouvelle race" canGoBack />

      <Main>
        <AnimalBreedForm
          onSubmit={createAnimalBreed}
          pending={isLoading}
          errors={formErrors}
        />
      </Main>
    </div>
  );
};

export default CreateAnimalBreedPage;
