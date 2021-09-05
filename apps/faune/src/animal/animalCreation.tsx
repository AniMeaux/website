import {
  AnimalFormPayload,
  createAnimalProfileCreationApiPayload,
  createAnimalSituationCreationApiPayload,
  createEmptyAnimalFormPayload,
  isEmptyAnimalFormPayload,
} from "@animeaux/shared-entities";
import constate from "constate";
import { Step, Stepper, StepStatus } from "core/controllers/stepper";
import { useRouter } from "core/router";
import { openStorage } from "core/storage";
import { ChildrenProp } from "core/types";
import invariant from "invariant";
import { useEffect, useLayoutEffect, useState } from "react";

export const AnimalFormDraftStorage = openStorage<AnimalFormPayload>(
  "animal-creation",
  1
);

function useAnimalFormPayload() {
  const [formPayload, setFormPayload] = useState<AnimalFormPayload>(() =>
    createEmptyAnimalFormPayload()
  );

  useEffect(() => {
    const draft = AnimalFormDraftStorage.load();

    if (
      draft != null &&
      !isEmptyAnimalFormPayload(draft) &&
      window.confirm("Reprendre le brouillon ?")
    ) {
      setFormPayload(draft);
    }
  }, []);

  useEffect(() => {
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

const [AnimalFormContextProvider, useAnimalForm] =
  constate(useAnimalFormPayload);

export { useAnimalForm };

const StepValidators: Record<string, (payload: AnimalFormPayload) => boolean> =
  {
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
    "pick-up-location": (payload) => {
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
  const [canRenderStep, setCanRenderStep] = useState(false);

  const router = useRouter();
  // Only keep the last path segment.
  const stepName = router.pathname.replace(/.*\//, "");

  useLayoutEffect(() => {
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

function getStepStatus(
  step: AnimalFormStep,
  currentStep: AnimalFormStep
): StepStatus {
  if (step === currentStep) {
    return "in-progress";
  }

  if (step < currentStep) {
    return "done";
  }

  return "pending";
}

type AnimalCreationStepperProps = {
  step: AnimalFormStep;
};

export function AnimalFormStepper({ step }: AnimalCreationStepperProps) {
  return (
    <Stepper>
      <Step
        href="../profile"
        status={getStepStatus(AnimalFormStep.PROFILE, step)}
      >
        Profil
      </Step>

      <Step
        href="../situation"
        status={getStepStatus(AnimalFormStep.SITUATION, step)}
      >
        Situation
      </Step>

      <Step
        href="../pictures"
        status={getStepStatus(AnimalFormStep.PICTURES, step)}
      >
        Photos
      </Step>
    </Stepper>
  );
}
