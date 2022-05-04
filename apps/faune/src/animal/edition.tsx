import constate from "constate";
import invariant from "invariant";
import { useCallback, useEffect, useState } from "react";
import { FormState, getInitialState } from "~/animal/formState";
import { useOperationQuery } from "~/core/operations";
import { useRouter } from "~/core/router";
import { SetStateAction } from "~/core/types";

function useAnimalFormPayload() {
  const router = useRouter();

  invariant(
    typeof router.query.animalId === "string",
    `The animalId path should be a string. Got '${typeof router.query
      .animalId}'`
  );

  const getAnimal = useOperationQuery({
    name: "getAnimal",
    params: { id: router.query.animalId },
  });

  const animal = getAnimal.state === "success" ? getAnimal.result : null;

  const [state, setState] = useState(getInitialState);

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
    if (animal != null) {
      setState(getInitialState(animal));
    }
  }, [animal]);

  return { ...state, setProfileState, setSituationState, setPicturesState };
}

const [AnimalFormProvider, useAnimalForm] = constate(useAnimalFormPayload);

export { AnimalFormProvider, useAnimalForm };
