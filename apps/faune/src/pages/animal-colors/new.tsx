import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  AnimalColorForm,
  AnimalColorFormErrors,
} from "animalColor/animalColorForm";
import { useCreateAnimalColor } from "animalColor/animalColorQueries";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { PageTitle } from "core/pageTitle";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";

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

      <Header>
        <HeaderBackLink />
        <HeaderTitle>Nouvelle couleur</HeaderTitle>
      </Header>

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

CreateAnimalColorPage.authorisedGroups = [UserGroup.ADMIN];

export default CreateAnimalColorPage;
