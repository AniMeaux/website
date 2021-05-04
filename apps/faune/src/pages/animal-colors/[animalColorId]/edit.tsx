import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
} from "@animeaux/shared-entities";
import { Header } from "core/header";
import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import {
  AnimalColorForm,
  AnimalColorFormErrors,
  AnimalColorFormPlaceholder,
} from "entities/animalColor/animalColorForm";
import {
  useAnimalColor,
  useUpdateAnimalColor,
} from "entities/animalColor/animalColorQueries";
import * as React from "react";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Main } from "ui/layouts/main";

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
    <ApplicationLayout>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack backHref="../.." />
      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

export default AnimalColorEditPage;
