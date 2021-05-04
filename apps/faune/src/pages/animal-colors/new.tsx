import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Header } from "core/header";
import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import {
  AnimalColorForm,
  AnimalColorFormErrors,
} from "entities/animalColor/animalColorForm";
import { useCreateAnimalColor } from "entities/animalColor/animalColorQueries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";

const CreateAnimalColorPage: PageComponent = () => {
  const router = useRouter();
  const [createAnimalColor, { error, isLoading }] = useCreateAnimalColor({
    onSuccess() {
      router.backIfPossible("..");
    },
  });

  const formErrors: AnimalColorFormErrors = {};

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.ANIMAL_COLOR_MISSING_NAME)) {
      formErrors.name = errorMessage;
    }
  }

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvelle couleur" />
      <Header headerTitle="Nouvelle couleur" canGoBack />

      <Main>
        <AnimalColorForm
          onSubmit={createAnimalColor}
          pending={isLoading}
          errors={formErrors}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

export default CreateAnimalColorPage;
