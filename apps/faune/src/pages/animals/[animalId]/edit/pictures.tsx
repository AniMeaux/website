import {
  AnimalPicturesForm,
  AnimalPicturesFormErrors,
  AnimalPicturesFormProps,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimal,
  useUpdateAnimalPicture,
} from "@animeaux/app-core";
import {
  Animal,
  AnimalPicturesFormPayload,
  ErrorCode,
  getAnimalDisplayName,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import {
  AnimalFormProvider,
  useAnimalForm,
} from "../../../../core/animalEdition";
import { PageTitle } from "../../../../core/pageTitle";

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
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack backHref="../.." />
      <Main>{content}</Main>
    </div>
  );
};

UpdateAnimalPicturesPage.WrapperComponent = AnimalFormProvider;

UpdateAnimalPicturesPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default UpdateAnimalPicturesPage;
