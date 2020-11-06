import { ErrorCode, getErrorMessage, hasErrorCode } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
} from "../../../../core/animalBreed/animalBreedForm";
import {
  useAnimalBreed,
  useUpdateAnimalBreed,
} from "../../../../core/animalBreed/animalBreedQueries";
import { PageComponent } from "../../../../core/pageComponent";
import {
  UserRoleForm,
  UserRoleFormPlaceholder,
} from "../../../../core/userRole/userRoleForm";
import {
  useUpdateUserRole,
  useUserRole,
} from "../../../../core/userRole/userRoleQueries";
import { Aside, AsideLayout } from "../../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderBackLink,
  HeaderCloseLink,
} from "../../../../ui/layouts/header";
import { PageTitle } from "../../../../ui/layouts/page";
import { Placeholder } from "../../../../ui/loaders/placeholder";
import { Message } from "../../../../ui/message";
import { AnimalBreedsPage } from "../index";

const EditAnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const animalBreedId = router.query.animalBreedId as string;
  const [animalBreed, animalBreedRequest] = useAnimalBreed(animalBreedId);
  const [updateAnimalBreed, updateAnimalBreedRequest] = useUpdateAnimalBreed();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (animalBreed != null) {
    pageTitle = `Modifier ${animalBreed.name}`;
    headerTitle = animalBreed.name;
  } else if (animalBreedRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (animalBreedRequest.error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
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
      globalErrorMessgae = errorMessage;
    }
  }

  let body: React.ReactNode | null = null;
  if (animalBreed != null) {
    body = (
      <AnimalBreedForm
        animalBreed={animalBreed}
        onSubmit={(formPayload) =>
          updateAnimalBreed({ currentAnimalBreed: animalBreed, formPayload })
        }
        pending={updateAnimalBreedRequest.isLoading}
        errors={{
          name:
            updateAnimalBreedRequest.error == null
              ? null
              : getErrorMessage(updateAnimalBreedRequest.error),
        }}
      />
    );
  } else if (animalBreedRequest.isLoading) {
    body = <UserRoleFormPlaceholder />;
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderBackLink href=".." />
        <AsideHeaderTitle>{headerTitle}</AsideHeaderTitle>
        <HeaderCloseLink href="../.." />
      </Header>

      <PageTitle title={pageTitle} />

      <Aside className="px-4">
        {globalErrorMessgae != null && (
          <Message type="error" className="mb-2">
            {globalErrorMessgae}
          </Message>
        )}

        {animalBreedRequest.error != null && (
          <Message type="error" className="mb-4">
            {getErrorMessage(animalBreedRequest.error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

EditAnimalBreedPage.resourcePermissionKey = "animal_breed";
EditAnimalBreedPage.WrapperComponent = AnimalBreedsPage;

export default EditAnimalBreedPage;
