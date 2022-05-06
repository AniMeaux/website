import { UserGroup } from "@animeaux/shared";
import {
  AnimalFormProvider,
  AnimalFormStep,
  AnimalFormStepper,
  useAnimalForm,
} from "~/animal/creation";
import { AnimalSituationForm } from "~/animal/situationForm";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { PageTitle } from "~/core/pageTitle";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";

const CreateAnimalSituationPage: PageComponent = () => {
  const { situationState, setSituationState } = useAnimalForm();
  const router = useRouter();

  return (
    <ApplicationLayout>
      <PageTitle title="Nouvel animal" />

      <Header>
        <HeaderBackLink href="../profile" />
        <HeaderTitle>Nouvel animal</HeaderTitle>
      </Header>

      <Main>
        <AnimalFormStepper step={AnimalFormStep.SITUATION} />
        <AnimalSituationForm
          state={situationState}
          setState={setSituationState}
          onSubmit={() => router.push("../pictures")}
        />
      </Main>

      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

CreateAnimalSituationPage.renderLayout = ({ children }) => {
  return <AnimalFormProvider>{children}</AnimalFormProvider>;
};

CreateAnimalSituationPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
];

export default CreateAnimalSituationPage;
