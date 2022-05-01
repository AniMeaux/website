import { Animal } from "@animeaux/shared";
import {
  FormState as PicturesFormState,
  getInitialState as getInitialPicturesState,
} from "animal/picturesForm";
import {
  FormState as ProfileFormState,
  getInitialState as getInitialProfileState,
} from "animal/profileForm";
import {
  FormState as SituationFormState,
  getInitialState as getInitialSituationState,
} from "animal/situationForm";

export type FormState = {
  profileState: ProfileFormState;
  situationState: SituationFormState;
  picturesState: PicturesFormState;
};

export function getInitialState(animal?: Animal): FormState {
  return {
    profileState: getInitialProfileState(animal),
    situationState: getInitialSituationState(animal),
    picturesState: getInitialPicturesState(animal),
  };
}
