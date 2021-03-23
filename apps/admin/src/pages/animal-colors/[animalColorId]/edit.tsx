import {
  AnimalColorForm,
  AnimalColorFormErrors,
  AnimalColorFormPlaceholder,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimalColor,
  useUpdateAnimalColor,
} from "@animeaux/app-core";
import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Main, useRouter } from "@animeaux/ui-library";
import * as React from "react";
import { PageTitle } from "../../../core/pageTitle";

const AnimalColorEditPage: PageComponent = () => {
  const router = useRouter();
  const animalColorId = router.query.animalColorId as string;
  const query = useAnimalColor(animalColorId);
  const [updateAnimalColor, mutation] = useUpdateAnimalColor({
    onSuccess() {
      router.backIfPossible("../..");
    },
  });

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animalColor) => animalColor.name,
    renderPlaceholder: () => <AnimalColorFormPlaceholder />,
    renderEntity: (animalColor) => (
      <AnimalColorForm
        animalColor={animalColor}
        onSubmit={(formPayload) =>
          updateAnimalColor({ currentAnimalColor: animalColor, formPayload })
        }
        pending={mutation.isLoading}
        errors={errors}
      />
    ),
  });

  const errors: AnimalColorFormErrors = {};
  if (mutation.error != null) {
    const errorMessage = getErrorMessage(mutation.error);

    if (hasErrorCode(mutation.error, ErrorCode.ANIMAL_COLOR_MISSING_NAME)) {
      errors.name = errorMessage;
    }
  }

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack backHref="../.." />
      <Main>{content}</Main>
    </div>
  );
};

export default AnimalColorEditPage;
