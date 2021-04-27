import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  AnimalBreedFormPlaceholder,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimalBreed,
  useUpdateAnimalBreed,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { ApplicationLayout, Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import { Navigation } from "../../../core/navigation";
import { PageTitle } from "../../../core/pageTitle";

const AnimalBreedEditPage: PageComponent = () => {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const query = useAnimalBreed(animalBreedId);
  const [updateAnimalBreed, mutation] = useUpdateAnimalBreed({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animalBreed) => animalBreed.name,
    renderPlaceholder: () => <AnimalBreedFormPlaceholder />,
    renderEntity: (animalBreed) => (
      <AnimalBreedForm
        animalBreed={animalBreed}
        onSubmit={(formPayload) =>
          updateAnimalBreed({ currentAnimalBreed: animalBreed, formPayload })
        }
        pending={mutation.isLoading}
        errors={errors}
      />
    ),
  });

  const errors: AnimalBreedFormErrors = {};
  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_BREED_MISSING_NAME)) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(mutation.error, ErrorCode.ANIMAL_BREED_MISSING_SPECIES)
    ) {
      errors.species = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />
      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

AnimalBreedEditPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalBreedEditPage;
