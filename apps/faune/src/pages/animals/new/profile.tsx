import {
  AnimalProfileForm,
  AnimalProfileFormErrors,
  Header,
  PageComponent,
  useCreateAnimalProfile,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  Main,
  resolveUrl,
  usePageScrollRestoration,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import {
  AnimalCreationStep,
  AnimalCreationStepper,
  AnimalFormProvider,
  useAnimalForm,
} from "../../../core/animalCreation";
import { PageTitle } from "../../../core/pageTitle";

const CreateAnimalProfilePage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  usePageScrollRestoration({
    disabled: router.query.restoreScroll == null,
  });

  const [createAnimalProfile, { error, isLoading }] = useCreateAnimalProfile({
    onSuccess() {
      router.push(resolveUrl(router.asPath, "../situation"));
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
    <div>
      <PageTitle title="Nouvel animal" />
      <Header headerTitle="Nouvel animal" canGoBack backHref="../.." />

      <Main>
        <AnimalCreationStepper step={AnimalCreationStep.PROFILE} />
        <AnimalProfileForm
          value={formPayload}
          onChange={setFormPayload}
          onSubmit={() => createAnimalProfile(formPayload)}
          pending={isLoading}
          errors={errors}
        />
      </Main>
    </div>
  );
};

CreateAnimalProfilePage.WrapperComponent = AnimalFormProvider;

CreateAnimalProfilePage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalProfilePage;
