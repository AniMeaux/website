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
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import * as React from "react";

const CreateAnimalSituationPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  const [createAnimalSituation, { error, isLoading }] =
    useCreateAnimalSituation({
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

      <Header>
        <HeaderBackLink href="../profile" />
        <HeaderTitle>Nouvel animal</HeaderTitle>
      </Header>

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
