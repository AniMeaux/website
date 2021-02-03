import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  AnimalBreedFormPlaceholder,
  Header,
  PageComponent,
  useAnimalBreed,
  useUpdateAnimalBreed,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, Placeholder, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../../core/pageTitle";

const AnimalBreedEditPage: PageComponent = () => {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const [animalBreed, query] = useAnimalBreed(animalBreedId);
  const [updateAnimalBreed, mutation] = useUpdateAnimalBreed({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (animalBreed != null) {
    pageTitle = `Modifier : ${animalBreed.name}`;
    headerTitle = pageTitle;
  } else if (query.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (query.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

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

  let content: React.ReactNode | null = null;

  if (animalBreed != null) {
    content = (
      <AnimalBreedForm
        animalBreed={animalBreed}
        onSubmit={(formPayload) =>
          updateAnimalBreed({ currentAnimalBreed: animalBreed, formPayload })
        }
        pending={mutation.isLoading}
        errors={errors}
      />
    );
  } else if (query.isLoading) {
    content = <AnimalBreedFormPlaceholder />;
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />
      <Main>{content}</Main>
    </div>
  );
};

export default AnimalBreedEditPage;
