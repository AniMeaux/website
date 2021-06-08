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
  AnimalFormDraftStorage,
  AnimalFormProvider,
  AnimalFormStep,
  AnimalFormStepper,
  useAnimalForm,
} from "entities/animal/animalCreation";
import {
  AnimalPicturesForm,
  AnimalPicturesFormErrors,
} from "entities/animal/formElements/animalPicturesForm";
import { useCreateAnimal } from "entities/animal/queries";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import * as React from "react";

const CreateAnimalPicturesPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  const [createAnimal, { error, isLoading }] = useCreateAnimal({
    onSuccess() {
      // We no longer need the draft.
      AnimalFormDraftStorage.clear();

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
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />

      <Header>
        <HeaderBackLink href="../situation" />
        <HeaderTitle>Nouvel animal</HeaderTitle>
      </Header>

      <Main>
        <AnimalFormStepper step={AnimalFormStep.PICTURES} />
        <AnimalPicturesForm
          value={formPayload}
          onChange={setFormPayload}
          onSubmit={() => createAnimal(formPayload)}
          pending={isLoading}
          errors={errors}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalPicturesPage.WrapperComponent = AnimalFormProvider;

CreateAnimalPicturesPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalPicturesPage;
