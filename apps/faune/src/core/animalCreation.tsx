import {
  AnimalFormPayload,
  createAnimalProfileCreationApiPayload,
  createAnimalSituationCreationApiPayload,
  createEmptyAnimalFormPayload,
} from "@animeaux/shared-entities";
import {
  ChildrenProp,
  resolveUrl,
  StepItem,
  StepLink,
  Stepper,
  StepStatus,
} from "@animeaux/ui-library";
import constate from "constate";
import invariant from "invariant";
import { useRouter } from "next/router";
import * as React from "react";

function useAnimalFormPayload() {
  const [formPayload, setFormPayload] = React.useState<AnimalFormPayload>(() =>
    createEmptyAnimalFormPayload()
  );

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
      router.replace(resolveUrl(router.asPath, "../profile"));
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

export enum AnimalCreationStep {
  PROFILE,
  SITUATION,
  PICTURES,
}

function getStepStatus(
  step: AnimalCreationStep,
  currentStep: AnimalCreationStep
) {
  if (step === currentStep) {
    return StepStatus.IN_PROGRESS;
  }

  if (step < currentStep) {
    return StepStatus.DONE;
  }

  return StepStatus.PENDING;
}

type AnimalCreationStepperProps = {
  step: AnimalCreationStep;
};

export function AnimalCreationStepper({ step }: AnimalCreationStepperProps) {
  return (
    <Stepper>
      <StepItem>
        <StepLink
          href="../profile"
          status={getStepStatus(AnimalCreationStep.PROFILE, step)}
        >
          Profil
        </StepLink>
      </StepItem>

      <StepItem>
        <StepLink
          href="../situation"
          status={getStepStatus(AnimalCreationStep.SITUATION, step)}
        >
          Situation
        </StepLink>
      </StepItem>

      <StepItem>
        <StepLink
          href="../pictures"
          status={getStepStatus(AnimalCreationStep.PICTURES, step)}
        >
          Photos
        </StepLink>
      </StepItem>
    </Stepper>
  );
}
