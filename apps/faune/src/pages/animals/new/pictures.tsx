import {
  AnimalPicturesForm,
  AnimalPicturesFormErrors,
  Header,
  PageComponent,
  useCreateAnimal,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import {
  AnimalCreationStep,
  AnimalCreationStepper,
  AnimalFormProvider,
  useAnimalForm,
} from "../../../core/animalCreation";
import { PageTitle } from "../../../core/pageTitle";

const CreateAnimalPicturesPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  const [createAnimal, { error, isLoading }] = useCreateAnimal({
    onSuccess() {
      // 3 is the number of steps to create an animal.
      router.backIfPossible("../..", 3);
    },
  });

  const errors: AnimalPicturesFormErrors = {};
  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.ANIMAL_MISSING_AVATAR)) {
      errors.avatar = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title="Nouvel animal" />
      <Header headerTitle="Nouvel animal" canGoBack backHref="../situation" />

      <Main>
        <AnimalCreationStepper step={AnimalCreationStep.PICTURES} />
        <AnimalPicturesForm
          value={formPayload}
          onChange={setFormPayload}
          onSubmit={() => createAnimal(formPayload)}
          pending={isLoading}
          errors={errors}
        />
      </Main>
    </div>
  );
};

CreateAnimalPicturesPage.WrapperComponent = AnimalFormProvider;

CreateAnimalPicturesPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalPicturesPage;
