import { AdoptionOption } from "@animeaux/shared";
import { FormState, INITIAL_FORM_STATE } from "animal/formState";
import constate from "constate";
import { useOperationQuery } from "core/operations";
import { useRouter } from "core/router";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import { useCallback, useEffect, useState } from "react";

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

  const [state, setState] = useState<FormState>(INITIAL_FORM_STATE);

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
      setState({
        profileState: {
          alias: animal.commonName ?? "",
          birthdate: animal.birthdate,
          breed: animal.breed ?? null,
          color: animal.color ?? null,
          description: animal.description ?? "",
          gender: animal.gender,
          iCadNumber: animal.iCadNumber ?? "",
          name: animal.officialName,
          species: animal.species,
          errors: [],
        },
        situationState: {
          adoptionDate: animal.adoptionDate ?? "",
          adoptionOption: animal.adoptionOption ?? AdoptionOption.UNKNOWN,
          comments: animal.comments ?? "",
          hostFamily: animal.hostFamily ?? null,
          isOkCats: animal.isOkCats,
          isOkChildren: animal.isOkChildren,
          isOkDogs: animal.isOkDogs,
          isSterilized: animal.isSterilized,
          pickUpDate: animal.pickUpDate,
          pickUpLocation: animal.pickUpLocation ?? "",
          pickUpReason: animal.pickUpReason,
          status: animal.status,
          errors: [],
        },
        picturesState: {
          pictures: [animal.avatarId].concat(animal.picturesId),
          errors: [],
        },
      });
    }
  }, [animal]);

  return { ...state, setProfileState, setSituationState, setPicturesState };
}

const [AnimalFormProvider, useAnimalForm] = constate(useAnimalFormPayload);

export { AnimalFormProvider, useAnimalForm };
