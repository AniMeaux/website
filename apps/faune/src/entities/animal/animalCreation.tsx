import {
  AnimalFormPayload,
  createAnimalProfileCreationApiPayload,
  createAnimalSituationCreationApiPayload,
  createEmptyAnimalFormPayload,
  isEmptyAnimalFormPayload,
} from "@animeaux/shared-entities";
import constate from "constate";
import { useRouter } from "core/router";
import { openStorage } from "core/storage";
import { ChildrenProp } from "core/types";
import invariant from "invariant";
import * as React from "react";
import {
  StepItem,
  StepLink,
  Stepper,
  StepStatus,
} from "ui/controllers/stepper";

export const AnimalFormDraftStorage = openStorage<AnimalFormPayload>(
  "animal-creation",
  1
);

function useAnimalFormPayload() {
  const [formPayload, setFormPayload] = React.useState<AnimalFormPayload>(() =>
    createEmptyAnimalFormPayload()
  );

  React.useEffect(() => {
    const draft = AnimalFormDraftStorage.load();

    if (
      draft != null &&
      !isEmptyAnimalFormPayload(draft) &&
      window.confirm("Reprendre le brouillon ?")
    ) {
      setFormPayload(draft);
    }
  }, []);

  React.useEffect(() => {
    if (isEmptyAnimalFormPayload(formPayload)) {
      AnimalFormDraftStorage.clear();
    } else {
      AnimalFormDraftStorage.save({
        ...formPayload,
        // We don't want to save image files, they're probably not serializable.
        pictures: [],
      });
    }
  }, [formPayload]);

  return { formPayload, setFormPayload };
}

const [AnimalFormContextProvider, useAnimalForm] = constate(
  useAnimalFormPayload
);

export { useAnimalForm };

const StepValidators: Record<
  string,
  (payload: AnimalFormPayload) => boolean
> = {
  profile: () => true,
  breed: () => true,
  color: () => true,
  situation: (payload) => {
    try {
      return createAnimalProfileCreationApiPayload(payload) != null;
    } catch (error) {
      return false;
    }
  },
  "host-family": (payload) => {
    try {
      return createAnimalProfileCreationApiPayload(payload) != null;
    } catch (error) {
      return false;
    }
  },
  "new-host-family": (payload) => {
    try {
      return createAnimalProfileCreationApiPayload(payload) != null;
    } catch (error) {
      return false;
    }
  },
  pictures: (payload) => {
    try {
      return (
        createAnimalProfileCreationApiPayload(payload) != null &&
        createAnimalSituationCreationApiPayload(payload) != null
      );
    } catch (error) {
      return false;
    }
  },
};

function AnimalFormRouting({ children }: ChildrenProp) {
  const { formPayload } = useAnimalForm();
  const [canRenderStep, setCanRenderStep] = React.useState(false);

  const router = useRouter();
  // Only keep the last path segment.
  const stepName = router.pathname.replace(/.*\//, "");

  React.useLayoutEffect(() => {
    const canRenderStep = StepValidators[stepName];
    invariant(canRenderStep != null, `No step validator found for ${stepName}`);

    if (canRenderStep(formPayload)) {
      setCanRenderStep(true);
    } else {
      // Redirect to the first step.
      router.replace("../profile");
    }
  }, [stepName, router, formPayload]);

  if (canRenderStep) {
    return <>{children}</>;
  }

  return null;
}

export function AnimalFormProvider({ children }: ChildrenProp) {
  return (
    <AnimalFormContextProvider>
      <AnimalFormRouting>{children}</AnimalFormRouting>
    </AnimalFormContextProvider>
  );
}

export enum AnimalFormStep {
  PROFILE,
  SITUATION,
  PICTURES,
}

function getStepStatus(step: AnimalFormStep, currentStep: AnimalFormStep) {
  if (step === currentStep) {
    return StepStatus.IN_PROGRESS;
  }

  if (step < currentStep) {
    return StepStatus.DONE;
  }

  return StepStatus.PENDING;
}

type AnimalCreationStepperProps = {
  step: AnimalFormStep;
};

export function AnimalFormStepper({ step }: AnimalCreationStepperProps) {
  return (
    <Stepper>
      <StepItem>
        <StepLink
          href="../profile"
          status={getStepStatus(AnimalFormStep.PROFILE, step)}
        >
          Profil
        </StepLink>
      </StepItem>

      <StepItem>
        <StepLink
          href="../situation"
          status={getStepStatus(AnimalFormStep.SITUATION, step)}
        >
          Situation
        </StepLink>
      </StepItem>

      <StepItem>
        <StepLink
          href="../pictures"
          status={getStepStatus(AnimalFormStep.PICTURES, step)}
        >
          Photos
        </StepLink>
      </StepItem>
    </Stepper>
  );
}
