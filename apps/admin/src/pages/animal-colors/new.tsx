import {
  AnimalColorForm,
  AnimalColorFormErrors,
  Header,
  PageComponent,
  useCreateAnimalColor,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import { PageTitle } from "../../core/pageTitle";

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
    <div>
      <PageTitle title="Nouvelle couleur" />
      <Header headerTitle="Nouvelle couleur" canGoBack />

      <Main>
        <AnimalColorForm
          onSubmit={createAnimalColor}
          pending={isLoading}
          errors={formErrors}
        />
      </Main>
    </div>
  );
};

export default CreateAnimalColorPage;
