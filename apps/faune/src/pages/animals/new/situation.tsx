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
  AnimalSituationForm,
  AnimalSituationFormErrors,
} from "entities/animal/formElements/animalSituationForm";
import { useCreateAnimalSituation } from "entities/animal/queries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";

const CreateAnimalSituationPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  const [
    createAnimalSituation,
    { error, isLoading },
  ] = useCreateAnimalSituation({
    onSuccess() {
      router.push("../pictures");
    },
  });

  const errors: AnimalSituationFormErrors = {};
  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.ANIMAL_INVALID_PICK_UP_DATE)) {
      errors.pickUpDate = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />
      <Header headerTitle="Nouvel animal" canGoBack backHref="../profile" />

      <Main>
        <AnimalFormStepper step={AnimalFormStep.SITUATION} />
        <AnimalSituationForm
          value={formPayload}
          onChange={setFormPayload}
          onSubmit={() => createAnimalSituation(formPayload)}
          pending={isLoading}
          errors={errors}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalSituationPage.WrapperComponent = AnimalFormProvider;

CreateAnimalSituationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalSituationPage;
