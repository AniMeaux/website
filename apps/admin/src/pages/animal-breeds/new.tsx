import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
  Header,
  useCreateAnimalBreed,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, resolveUrl } from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { PageTitle } from "../../core/pageTitle";

export default function CreateAnimalBreedPage() {
  const router = useRouter();
  const [createAnimalBreed, { error, isLoading }] = useCreateAnimalBreed({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  const formErrors: AnimalBreedFormErrors = {};

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.ANIMAL_BREED_MISSING_NAME)) {
      formErrors.name = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.ANIMAL_BREED_MISSING_SPECIES)) {
      formErrors.species = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title="Nouvelle race" />
      <Header headerTitle="Nouvelle race" canGoBack />

      <Main>
        <AnimalBreedForm
          onSubmit={createAnimalBreed}
          pending={isLoading}
          errors={formErrors}
        />
      </Main>
    </div>
  );
}
