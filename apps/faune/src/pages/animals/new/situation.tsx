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
  AnimalSituationForm,
  AnimalSituationFormErrors,
} from "animal/formElements/animalSituationForm";
import { useCreateAnimalSituation } from "animal/queries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

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

    if (hasErrorCode(error, ErrorCode.ANIMAL_MISSING_PICK_UP_LOCATION)) {
      errors.pickUpLocation = errorMessage;
    }

    if (hasErrorCode(error, ErrorCode.ANIMAL_MISSING_ADOPTION_DATE)) {
      errors.adoptionDate = errorMessage;
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
