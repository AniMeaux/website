import { ErrorCode, getErrorMessage, hasErrorCode } from "@animeaux/shared";
import * as React from "react";
import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
} from "../../../core/animalBreed/animalBreedForm";
import { useCreateAnimalBreed } from "../../../core/animalBreed/animalBreedQueries";
import { PageComponent } from "../../../core/pageComponent";
import { Aside, AsideLayout } from "../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../../ui/layouts/header";
import { PageTitle } from "../../../ui/layouts/page";
import { Message } from "../../../ui/message";
import { AnimalBreedsPage } from "./index";

const NewAnimalBreedPage: PageComponent = () => {
  const [createAnimalBreed, createAnimalBreedRequest] = useCreateAnimalBreed();

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
      globalErrorMessgae = errorMessage;
    }
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>Nouvelle race animale</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title="Nouvelle race animale" />

      <Aside className="px-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        <AnimalBreedForm
          onSubmit={createAnimalBreed}
          pending={createAnimalBreedRequest.isLoading}
          errors={errors}
        />
      </Aside>
    </AsideLayout>
  );
};

NewAnimalBreedPage.resourcePermissionKey = "animal_breed";
NewAnimalBreedPage.WrapperComponent = AnimalBreedsPage;

export default NewAnimalBreedPage;
