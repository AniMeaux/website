import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Header } from "core/header";
import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
} from "entities/animalBreed/animalBreedForm";
import { useCreateAnimalBreed } from "entities/animalBreed/animalBreedQueries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";

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
