import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  AnimalFormProvider,
  AnimalFormStep,
  AnimalFormStepper,
  useAnimalForm,
} from "animal/animalCreation";
import {
  AnimalProfileForm,
  AnimalProfileFormErrors,
} from "animal/formElements/animalProfileForm";
import { useCreateAnimalProfile } from "animal/queries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import * as React from "react";

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

      <Header>
        <HeaderBackLink href="../.." />
        <HeaderTitle>Nouvel animal</HeaderTitle>
      </Header>

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
