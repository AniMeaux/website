import {
  AnimalSituationForm,
  AnimalSituationFormErrors,
  AnimalSituationFormProps,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimal,
  useUpdateAnimalSituation,
} from "@animeaux/app-core";
import {
  Animal,
  AnimalSituationFormPayload,
  ErrorCode,
  getAnimalDisplayName,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { ApplicationLayout, Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "../../../../core/animalEdition";
import { Navigation } from "../../../../core/navigation";
import { PageTitle } from "../../../../core/pageTitle";

type AnimalEditSituationFormProps = Omit<
  AnimalSituationFormProps<AnimalSituationFormPayload>,
  "value" | "onChange" | "onSubmit"
> & {
  animal: Animal;
  onSubmit: (payload: AnimalSituationFormPayload) => any;
};

function AnimalEditSituationForm({
  animal,
  onSubmit,
  ...rest
}: AnimalEditSituationFormProps) {
  const { formPayload, setFormPayload } = useAnimalForm();

  return (
    <AnimalSituationForm
      {...rest}
      isEdit
      value={formPayload}
      onChange={setFormPayload}
      onSubmit={() => onSubmit(formPayload)}
    />
  );
}

const UpdateAnimalSituationPage: PageComponent = () => {
  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);

  const [updateAnimalSituation, mutation] = useUpdateAnimalSituation({
    onSuccess() {
      router.backIfPossible("../..");
    },
  });

  const errors: AnimalSituationFormErrors = {};
  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_INVALID_PICK_UP_DATE)) {
      errors.pickUpDate = errorMessage;
    }
  }

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animal) => getAnimalDisplayName(animal),
    renderPlaceholder: () => null,
    renderEntity: (animal) => (
      <AnimalEditSituationForm
        animal={animal}
        onSubmit={(formPayload) =>
          updateAnimalSituation({ currentAnimal: animal, formPayload })
        }
        pending={mutation.isLoading}
        errors={errors}
      />
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack backHref="../.." />
      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

UpdateAnimalSituationPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalSituationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalSituationPage;
