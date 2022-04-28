import { doesGroupsIntersect, User, UserGroup } from "@animeaux/shared";
import { useCurrentUser } from "account/currentUser";
import { FormState, INITIAL_FORM_STATE } from "animal/formState";
import { validate as validateProfile } from "animal/profileForm";
import { validate as validateSituation } from "animal/situationForm";
import constate from "constate";
import {
  Step,
  Stepper as BaseStepper,
  StepStatus,
} from "core/controllers/stepper";
import { useRouter } from "core/router";
import { Storage } from "core/storage";
import { ChildrenProp, SetStateAction } from "core/types";
import invariant from "invariant";
import isEqual from "lodash.isequal";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { theme } from "styles/theme";

export const AnimalFormDraftStorage = new Storage<FormState>(
  "animal-creation",
  2,
  () => undefined
);

const [AnimalFormContextProvider, useAnimalForm] = constate(() => {
  const { currentUser } = useCurrentUser();
  const initialState = useRef(getInitialState(currentUser));
  const [state, setState] = useState(initialState.current);

  const setProfileState = useCallback<
    React.Dispatch<SetStateAction<FormState["profileState"]>>
  >((change) => {
    setState((prevState) => ({
      ...prevState,
      profileState: change(prevState.profileState),
    }));
  }, []);

  const setSituationState = useCallback<
    React.Dispatch<SetStateAction<FormState["situationState"]>>
  >((change) => {
    setState((prevState) => ({
      ...prevState,
      situationState: change(prevState.situationState),
    }));
  }, []);

  const setPicturesState = useCallback<
    React.Dispatch<SetStateAction<FormState["picturesState"]>>
  >((change) => {
    setState((prevState) => ({
      ...prevState,
      picturesState: change(prevState.picturesState),
    }));
  }, []);

  useEffect(() => {
    const draft = AnimalFormDraftStorage.load();

    if (
      draft != null &&
      !isEqual(draft, initialState.current) &&
      window.confirm("Reprendre le brouillon ?")
    ) {
      setState(draft);
    }
  }, []);

  useEffect(() => {
    if (isEqual(state, initialState.current)) {
      AnimalFormDraftStorage.clear();
    } else {
      AnimalFormDraftStorage.save({
        profileState: { ...state.profileState, errors: [] },
        situationState: { ...state.situationState, errors: [] },
        // We don't want to save image files, they're probably not serializable.
        picturesState: INITIAL_FORM_STATE.picturesState,
      });
    }
  }, [state]);

  return {
    ...state,
    setProfileState,
    setSituationState,
    setPicturesState,
  };
});

function getInitialState(currentUser: User): FormState {
  if (doesGroupsIntersect(currentUser.groups, [UserGroup.ANIMAL_MANAGER])) {
    return {
      ...INITIAL_FORM_STATE,
      situationState: {
        ...INITIAL_FORM_STATE.situationState,
        manager: {
          id: currentUser.id,
          displayName: currentUser.displayName,
        },
      },
    };
  }

  return INITIAL_FORM_STATE;
}

export { useAnimalForm };

export function AnimalFormProvider({ children }: ChildrenProp) {
  return (
    <AnimalFormContextProvider>
      <AnimalFormRouting>{children}</AnimalFormRouting>
    </AnimalFormContextProvider>
  );
}

const STEPS_VALIDATOR: Record<string, (state: FormState) => void> = {
  profile: () => {},
  breed: () => {},
  color: () => {},
  situation: ({ profileState }) => validateProfile(profileState),
  "host-family": ({ profileState }) => validateProfile(profileState),
  manager: ({ profileState }) => validateProfile(profileState),
  "new-host-family": ({ profileState }) => validateProfile(profileState),
  "pick-up-location": ({ profileState }) => validateProfile(profileState),
  pictures: ({ profileState, situationState }) => {
    validateProfile(profileState);
    validateSituation(situationState);
  },
};

function AnimalFormRouting({ children }: ChildrenProp) {
  const { profileState, situationState, picturesState } = useAnimalForm();
  const router = useRouter();
  const routerRef = useRef(router);
  useLayoutEffect(() => {
    routerRef.current = router;
  });

  // Only keep the last path segment.
  const stepName = router.pathname.replace(/.*\//, "");
  const validator = STEPS_VALIDATOR[stepName];
  invariant(validator != null, `No step validator found for ${stepName}`);

  let canRenderStep = false;
  try {
    validator({ profileState, situationState, picturesState });
    canRenderStep = true;
  } catch (error) {}

  useLayoutEffect(() => {
    if (!canRenderStep) {
      // Redirect to the first step.
      routerRef.current.replace("../profile");
    }
  }, [canRenderStep]);

  if (canRenderStep) {
    return <>{children}</>;
  }

  return null;
}

// Use number enum to allow comparisons.
// Ex: PROFILE < SITUATION
export enum AnimalFormStep {
  PROFILE,
  SITUATION,
  PICTURES,
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

const Stepper = styled(BaseStepper)`
  margin-bottom: ${theme.spacing.x3};
`;

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
