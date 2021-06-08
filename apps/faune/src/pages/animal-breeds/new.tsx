import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
} from "entities/animalBreed/animalBreedForm";
import { useCreateAnimalBreed } from "entities/animalBreed/animalBreedQueries";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import * as React from "react";

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

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvelle race</HeaderTitle>
      </Header>

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
