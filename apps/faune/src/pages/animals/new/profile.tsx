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
  AnimalFormProvider,
  AnimalFormStep,
  AnimalFormStepper,
  useAnimalForm,
} from "entities/animal/animalCreation";
import {
  AnimalProfileForm,
  AnimalProfileFormErrors,
} from "entities/animal/formElements/animalProfileForm";
import { useCreateAnimalProfile } from "entities/animal/queries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";

const CreateAnimalProfilePage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  const [createAnimalProfile, { error, isLoading }] = useCreateAnimalProfile({
    onSuccess() {
      router.push("../situation");
    },
  });

  const errors: AnimalProfileFormErrors = {};
  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME)) {
      errors.officialName = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.ANIMAL_INVALID_BIRTHDATE)) {
      errors.birthdate = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.ANIMAL_MISSING_GENDER)) {
      errors.gender = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.ANIMAL_MISSING_SPECIES)) {
      errors.species = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH)) {
      errors.breed = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
      <Header headerTitle="Nouvel animal" canGoBack backHref="../.." />

      <Main>
        <AnimalFormStepper step={AnimalFormStep.PROFILE} />
        <AnimalProfileForm
          value={formPayload}
          onChange={setFormPayload}
          onSubmit={() => createAnimalProfile(formPayload)}
          pending={isLoading}
          errors={errors}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalProfilePage.WrapperComponent = AnimalFormProvider;

CreateAnimalProfilePage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalProfilePage;
