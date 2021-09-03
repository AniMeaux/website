import {
  Animal,
  AnimalSituationFormPayload,
  ErrorCode,
  getAnimalDisplayName,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalEdition";
import {
  AnimalSituationForm,
  AnimalSituationFormErrors,
  AnimalSituationFormProps,
} from "animal/formElements/animalSituationForm";
import { useAnimal, useUpdateAnimalSituation } from "animal/queries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import * as React from "react";

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

    if (
      hasErrorCode(mutation.error, ErrorCode.ANIMAL_MISSING_PICK_UP_LOCATION)
    ) {
      errors.pickUpLocation = errorMessage;
    }

    if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_MISSING_ADOPTION_DATE)) {
      errors.adoptionDate = errorMessage;
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

      <Header>
        <HeaderBackLink href="../.." />
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>

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
