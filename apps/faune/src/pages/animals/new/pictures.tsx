import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  AnimalFormDraftStorage,
  AnimalFormProvider,
  AnimalFormStep,
  AnimalFormStepper,
  useAnimalForm,
} from "animal/animalCreation";
import {
  AnimalPicturesForm,
  AnimalPicturesFormErrors,
} from "animal/formElements/animalPicturesForm";
import { useCreateAnimal } from "animal/queries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

const CreateAnimalPicturesPage: PageComponent = () => {
  const { formPayload, setFormPayload } = useAnimalForm();
  const router = useRouter();

  const [createAnimal, { error, isLoading }] = useCreateAnimal({
    onSuccess() {
      // We no longer need the draft.
      AnimalFormDraftStorage.clear();

      // 3 is the number of steps to create an animal.
      router.backIfPossible("../..", { historyOffset: 3 });
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
