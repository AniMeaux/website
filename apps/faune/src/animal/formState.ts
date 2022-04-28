import {
  AdoptionOption,
  AnimalStatus,
  PickUpReason,
  Trilean,
} from "@animeaux/shared";
import { FormState as PicturesFormState } from "animal/picturesForm";
import { FormState as ProfileFormState } from "animal/profileForm";
import { FormState as SituationFormState } from "animal/situationForm";

export type FormState = {
  profileState: ProfileFormState;
  situationState: SituationFormState;
  picturesState: PicturesFormState;
};

export const INITIAL_FORM_STATE: FormState = {
  profileState: {
    alias: "",
    birthdate: "",
    breed: null,
    color: null,
    description: "",
    gender: null,
    iCadNumber: "",
    name: "",
    species: null,
    errors: [],
  },
  situationState: {
    manager: null,
    adoptionDate: "",
    adoptionOption: AdoptionOption.UNKNOWN,
    comments: "",
    hostFamily: null,
    isOkCats: Trilean.UNKNOWN,
    isOkChildren: Trilean.UNKNOWN,
    isOkDogs: Trilean.UNKNOWN,
    isSterilized: false,
    pickUpDate: "",
    pickUpLocation: null,
    pickUpReason: PickUpReason.OTHER,
    status: AnimalStatus.UNAVAILABLE,
    errors: [],
  },
  picturesState: { pictures: [], errors: [] },
};
