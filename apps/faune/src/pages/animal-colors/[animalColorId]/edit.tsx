import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  AnimalColorForm,
  AnimalColorFormErrors,
  AnimalColorFormPlaceholder,
} from "animalColor/animalColorForm";
import {
  useAnimalColor,
  useUpdateAnimalColor,
} from "animalColor/animalColorQueries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import * as React from "react";

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

      <Header>
        <HeaderBackLink href="../.." />
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

AnimalColorEditPage.authorisedGroups = [UserGroup.ADMIN];

export default AnimalColorEditPage;
