import {
  AnimalSituationForm,
  AnimalSituationFormErrors,
  Header,
  PageComponent,
  useCreateAnimalSituation,
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

const CreateAnimalSituationPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  usePageScrollRestoration({
    disabled: router.query.restoreScroll == null,
  });

  const [
    createAnimalSituation,
    { error, isLoading },
  ] = useCreateAnimalSituation({
    onSuccess() {
      router.push(resolveUrl(router.asPath, "../pictures"));
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
    <div>
      <PageTitle title="Nouvel animal" />
      <Header headerTitle="Nouvel animal" canGoBack backHref="../profile" />

      <Main>
        <AnimalCreationStepper step={AnimalCreationStep.SITUATION} />
        <AnimalSituationForm
          value={formPayload}
          onChange={setFormPayload}
          onSubmit={() => createAnimalSituation(formPayload)}
          pending={isLoading}
          errors={errors}
        />
      </Main>
    </div>
  );
};

CreateAnimalSituationPage.WrapperComponent = AnimalFormProvider;

CreateAnimalSituationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalSituationPage;
