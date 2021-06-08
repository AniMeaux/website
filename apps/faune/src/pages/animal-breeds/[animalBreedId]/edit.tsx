import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  AnimalBreedFormPlaceholder,
} from "entities/animalBreed/animalBreedForm";
import {
  useAnimalBreed,
  useUpdateAnimalBreed,
} from "entities/animalBreed/animalBreedQueries";
import { ApplicationLayout } from "layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "layouts/header";
import { Main } from "layouts/main";
import { Navigation } from "layouts/navigation";
import * as React from "react";

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

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

AnimalBreedEditPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalBreedEditPage;
