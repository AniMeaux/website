import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  PageTitle,
  useCreateAnimalBreed,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
  Main,
  Message,
  resolveUrl,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";

export default function CreateAnimalBreedPage() {
  const router = useRouter();
  const [createAnimalBreed, createAnimalBreedRequest] = useCreateAnimalBreed(
    (animalBreed) => {
      router.push(
        resolveUrl(router.asPath, `../${animalBreed.id}?creationSucceeded`)
      );
    }
  );

  const errors: AnimalBreedFormErrors = {};
  let globalErrorMessgae: string | null = null;

  if (createAnimalBreedRequest.error != null) {
    const errorMessage = getErrorMessage(createAnimalBreedRequest.error);

    if (
      hasErrorCode(
        createAnimalBreedRequest.error,
        ErrorCode.ANIMAL_BREED_MISSING_NAME
      )
    ) {
      errors.name = errorMessage;
    } else if (
      hasErrorCode(
        createAnimalBreedRequest.error,
        ErrorCode.ANIMAL_BREED_MISSING_SPECIES
      )
    ) {
      errors.species = errorMessage;
    } else {
      // Also display `ErrorCode.ANIMAL_BREED_ALREADY_EXIST` as global error.
      globalErrorMessgae = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title="Nouvelle race" />

      <Header>
        <HeaderBackLink href=".." />
        <HeaderTitle>Nouvelle race</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      <Main>
        {globalErrorMessgae != null && (
          <Message type="error" className="mx-4 mb-4">
            {globalErrorMessgae}
          </Message>
        )}

        <AnimalBreedForm
          onSubmit={createAnimalBreed}
          pending={createAnimalBreedRequest.isLoading}
          errors={errors}
        />
      </Main>
    </div>
  );
}
