import {
  AdoptionOption,
  AnimalGender,
  AnimalSpecies,
  AnimalStatus,
  PickUpReason,
  Trilean,
} from "@animeaux/shared";

export const ANIMAL_COLLECTION = "animals";
export const ANIMAL_SAVED_COLLECTION = "saved_animals";

export type AnimalFromStore = {
  id: string;
  officialName: string;
  commonName?: string | null;
  birthdate: string;
  birthdateTimestamp: number;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedId?: string | null;
  colorId?: string | null;
  description?: string | null;
  avatarId: string;
  picturesId: string[];
  pickUpDate: string;
  pickUpDateTimestamp: number;
  pickUpLocation?: string | null;
  pickUpReason: PickUpReason;
  status: AnimalStatus;
  adoptionDate?: string | null;
  adoptionDateTimestamp?: number | null;
  adoptionOption?: AdoptionOption | null;
  hostFamilyId?: string | null;
  iCadNumber?: string | null;
  comments?: string | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

export function getDisplayName(
  animal: Pick<AnimalFromStore, "officialName" | "commonName">
) {
  if (animal.commonName != null && animal.commonName !== "") {
    return `${animal.officialName} (${animal.commonName})`;
  }

  return animal.officialName;
}
