import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  AnimalBreedForm,
  AnimalBreedFormErrors,
} from "animalBreed/animalBreedForm";
import { useCreateAnimalBreed } from "animalBreed/animalBreedQueries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

const CreateAnimalBreedPage: PageComponent = () => {
  const router = useRouter();
  const [createAnimalBreed, { error, isLoading }] = useCreateAnimalBreed({
    onSuccess() {
      router.backIfPossible("..");
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
    <ApplicationLayout>
      <PageTitle title="Nouvelle race" />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvelle race</HeaderTitle>
      </Header>

      <Main>
        <AnimalBreedForm
          onSubmit={createAnimalBreed}
          pending={isLoading}
          errors={formErrors}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalBreedPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateAnimalBreedPage;
