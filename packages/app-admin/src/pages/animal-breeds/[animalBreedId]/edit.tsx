import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  AnimalBreedFormPlaceholder,
  PageTitle,
  useAnimalBreed,
  useUpdateAnimalBreed,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, Message, Placeholder, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { Header } from "../../../core/header";
import { Navigation } from "../../../core/navigation";

export default function AnimalBreedEditPage() {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const [animalBreed, animalBreedRequest] = useAnimalBreed(animalBreedId);
  const [updateAnimalBreed, updateAnimalBreedRequest] = useUpdateAnimalBreed(
    () => {
      router.push(resolveUrl(router.asPath, "..?updateSucceeded"));
    }
  );

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (animalBreed != null) {
    pageTitle = `Modifier : ${animalBreed.name}`;
    headerTitle = pageTitle;
  } else if (animalBreedRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (animalBreedRequest.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  const errors: AnimalBreedFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (updateAnimalBreedRequest.error != null) {
    const errorMessage = getErrorMessage(updateAnimalBreedRequest.error);

    if (
      hasErrorCode(
        updateAnimalBreedRequest.error,
        ErrorCode.ANIMAL_BREED_MISSING_NAME
      )
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(
        updateAnimalBreedRequest.error,
        ErrorCode.ANIMAL_BREED_MISSING_SPECIES
      )
    ) {
      errors.species = errorMessage;
    } else {
      // Also display `ErrorCode.ANIMAL_BREED_ALREADY_EXIST` as global error.
      globalErrorMessgae = errorMessage;
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
        pending={updateAnimalBreedRequest.isLoading}
        errors={errors}
      />
    );
  } else if (animalBreedRequest.isLoading) {
    content = <AnimalBreedFormPlaceholder />;
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />

      <Main>
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-4">
            {globalErrorMessgae}
          </Message>
        )}

        {animalBreedRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(animalBreedRequest.error)}
          </Message>
        )}

        {content}
      </Main>

      <Navigation hideOnSmallScreen />
    </div>
  );
}
