import {
  Animal,
  AnimalPicturesFormPayload,
  ErrorCode,
  getAnimalDisplayName,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "entities/animal/animalEdition";
import {
  AnimalPicturesForm,
  AnimalPicturesFormErrors,
  AnimalPicturesFormProps,
} from "entities/animal/formElements/animalPicturesForm";
import { useAnimal, useUpdateAnimalPicture } from "entities/animal/queries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "ui/layouts/header";
import { Main } from "ui/layouts/main";

type AnimalEditPicturesFormProps = Omit<
  AnimalPicturesFormProps<AnimalPicturesFormPayload>,
  "value" | "onChange" | "onSubmit"
> & {
  animal: Animal;
  onSubmit: (payload: AnimalPicturesFormPayload) => any;
};

function AnimalEditPicturesForm({
  animal,
  onSubmit,
  ...rest
}: AnimalEditPicturesFormProps) {
  const { formPayload, setFormPayload } = useAnimalForm();

  return (
    <AnimalPicturesForm
      {...rest}
      isEdit
      value={formPayload}
      onChange={setFormPayload}
      onSubmit={() => onSubmit(formPayload)}
    />
  );
}

const UpdateAnimalPicturesPage: PageComponent = () => {
  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);

  const [updateAnimalPictures, mutation] = useUpdateAnimalPicture({
    onSuccess() {
      router.backIfPossible("../..");
    },
  });

  const errors: AnimalPicturesFormErrors = {};
  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_MISSING_AVATAR)) {
      errors.avatar = errorMessage;
    }
  }

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animal) => getAnimalDisplayName(animal),
    renderPlaceholder: () => null,
    renderEntity: (animal) => (
      <AnimalEditPicturesForm
        animal={animal}
        onSubmit={(formPayload) =>
          updateAnimalPictures({ currentAnimal: animal, formPayload })
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

UpdateAnimalPicturesPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalPicturesPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalPicturesPage;
