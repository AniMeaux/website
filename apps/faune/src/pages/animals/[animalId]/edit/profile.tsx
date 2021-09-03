import {
  Animal,
  AnimalProfileFormPayload,
  ErrorCode,
  getAnimalDisplayName,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { AnimalFormProvider, useAnimalForm } from "animal/animalEdition";
import {
  AnimalProfileForm,
  AnimalProfileFormErrors,
  AnimalProfileFormProps,
} from "animal/formElements/animalProfileForm";
import { useAnimal, useUpdateAnimalProfile } from "animal/queries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import * as React from "react";

type AnimalEditProfileFormProps = Omit<
  AnimalProfileFormProps<AnimalProfileFormPayload>,
  "value" | "onChange" | "onSubmit"
> & {
  animal: Animal;
  onSubmit: (payload: AnimalProfileFormPayload) => any;
};

function AnimalEditProfileForm({
  animal,
  onSubmit,
  ...rest
}: AnimalEditProfileFormProps) {
  const { formPayload, setFormPayload } = useAnimalForm();

  return (
    <AnimalProfileForm
      {...rest}
      isEdit
      value={formPayload}
      onChange={setFormPayload}
      onSubmit={() => onSubmit(formPayload)}
    />
  );
}

const UpdateAnimalProfilePage: PageComponent = () => {
  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);

  const [updateAnimalProfile, mutation] = useUpdateAnimalProfile({
    onSuccess() {
      router.backIfPossible("../..");
    },
  });

  const errors: AnimalProfileFormErrors = {};
  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME)) {
      errors.officialName = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.ANIMAL_INVALID_BIRTHDATE)
    ) {
      errors.birthdate = errorMessage;
    } else if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_MISSING_GENDER)) {
      errors.gender = errorMessage;
    } else if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_MISSING_SPECIES)) {
      errors.species = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH)
    ) {
      errors.breed = errorMessage;
    }
  }

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animal) => getAnimalDisplayName(animal),
    renderPlaceholder: () => null,
    renderEntity: (animal) => (
      <AnimalEditProfileForm
        animal={animal}
        onSubmit={(formPayload) =>
          updateAnimalProfile({ currentAnimal: animal, formPayload })
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

UpdateAnimalProfilePage.WrapperComponent = AnimalFormProvider;

UpdateAnimalProfilePage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalProfilePage;
