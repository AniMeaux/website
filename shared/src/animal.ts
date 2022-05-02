import { AnimalBreed } from "./animalBreed";
import { AnimalColor } from "./animalColor";
import {
  OperationPaginationParams,
  OperationPaginationResult,
} from "./operationPagination";
import { Trilean } from "./trilean";

export enum AnimalSpecies {
  BIRD = "BIRD",
  CAT = "CAT",
  DOG = "DOG",
  REPTILE = "REPTILE",
  RODENT = "RODENT",
}

export const ALL_ANIMAL_SPECIES = Object.values(AnimalSpecies);

export enum AnimalGender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export enum PickUpReason {
  ABANDONMENT = "ABANDONMENT",
  DECEASED_MASTER = "DECEASED_MASTER",
  MISTREATMENT = "MISTREATMENT",
  STRAY_ANIMAL = "STRAY_ANIMAL",
  OTHER = "OTHER",
}

export enum AnimalStatus {
  ADOPTED = "ADOPTED",
  DECEASED = "DECEASED",
  FREE = "FREE",
  OPEN_TO_ADOPTION = "OPEN_TO_ADOPTION",
  OPEN_TO_RESERVATION = "OPEN_TO_RESERVATION",
  RESERVED = "RESERVED",
  UNAVAILABLE = "UNAVAILABLE",
}

export const ALL_ANIMAL_STATUSES = Object.values(AnimalStatus);

export enum AdoptionOption {
  WITH_STERILIZATION = "WITH_STERILIZATION",
  WITHOUT_STERILIZATION = "WITHOUT_STERILIZATION",
  FREE_DONATION = "FREE_DONATION",
  UNKNOWN = "UNKNOWN",
}

export enum AnimalAge {
  JUNIOR = "JUNIOR",
  ADULT = "ADULT",
  SENIOR = "SENIOR",
}

export type AnimalActiveBrief = {
  id: string;
  displayName: string;
  avatarId: string;
  status: AnimalStatus;
  managerName?: string;
};

export type PublicAnimalSearchHit = {
  id: string;
  displayName: string;
  avatarId: string;
  birthdate: string;
  gender: AnimalGender;
  breedName?: string;
  colorName?: string;
};

export type AnimalSearchHit = {
  id: string;
  displayName: string;
  highlightedDisplayName: string;
  avatarId: string;
  status: AnimalStatus;
};

export type PublicAnimal = {
  id: string;
  displayName: string;
  avatarId: string;
  picturesId: string[];
  birthdate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedName?: string;
  colorName?: string;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
  description?: string;
};

export type Animal = {
  id: string;
  officialName: string;
  commonName?: string;
  displayName: string;
  birthdate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breed?: AnimalBreed;
  color?: AnimalColor;
  description?: string;
  avatarId: string;
  picturesId: string[];
  pickUpDate: string;
  pickUpLocation?: string;
  pickUpReason: PickUpReason;
  status: AnimalStatus;
  adoptionDate?: string;
  adoptionOption?: AdoptionOption;
  manager?: {
    id: string;
    displayName: string;
  };
  hostFamily?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    formattedAddress: string;
  };
  iCadNumber?: string;
  comments?: string;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

export type AnimalProfileInput = {
  officialName: string;
  commonName: string | null;
  birthdate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedId: string | null;
  colorId: string | null;
  description: string | null;
  iCadNumber: string | null;
};

export type AnimalSituationInput = {
  status: AnimalStatus;
  adoptionDate: string | null;
  adoptionOption: AdoptionOption | null;
  pickUpDate: string;
  pickUpLocation: string | null;
  pickUpReason: PickUpReason;
  hostFamilyId: string | null;
  managerId: string;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
  comments: string | null;
};

export type AnimalPicturesInput = {
  avatarId: string;
  picturesId: string[];
};

export type AnimalInput = AnimalProfileInput &
  AnimalSituationInput &
  AnimalPicturesInput;

export type LocationSearchHit = {
  value: string;
  highlightedValue: string;
};

export type ManagerSearchHit = {
  id: string;
  email: string;
  highlightedEmail: string;
  displayName: string;
  highlightedDisplayName: string;
};

export type AnimalOperations = {
  getAllActiveAnimals: (params: {
    onlyManagedByCurrentUser?: boolean;
  }) => AnimalActiveBrief[];

  getAllSavedAnimals: (
    params: OperationPaginationParams
  ) => OperationPaginationResult<PublicAnimalSearchHit>;

  getAllAdoptableAnimals(
    params: OperationPaginationParams & {
      species?: AnimalSpecies;
      age?: AnimalAge;
    }
  ): OperationPaginationResult<PublicAnimalSearchHit>;

  searchAnimals: (
    params: OperationPaginationParams & {
      search: string;
      species?: AnimalSpecies[];
      status?: AnimalStatus[];
    }
  ) => OperationPaginationResult<AnimalSearchHit>;

  getAnimal: (params: { id: string }) => Animal;
  getAdoptableAnimal: (params: { id: string }) => PublicAnimal;

  createAnimal: (params: AnimalInput) => Animal;
  updateAnimalProfile: (params: { id: string } & AnimalProfileInput) => Animal;
  updateAnimalSituation: (
    params: { id: string } & AnimalSituationInput
  ) => Animal;
  updateAnimalPictures: (
    params: { id: string } & AnimalPicturesInput
  ) => Animal;
  deleteAnimal: (params: { id: string }) => boolean;
  searchLocation: (params: { search: string }) => LocationSearchHit[];
  searchManager: (params: { search: string }) => ManagerSearchHit[];
};

type AgeRange = {
  minMonths: number;
  maxMonths: number;
};

// 100 years
const MAX_ANIMAL_MONTHS = 100 * 12;

// `maxMonths` is excluded.
export const ANIMAL_AGE_RANGE_BY_SPECIES: Partial<
  Record<AnimalSpecies, Partial<Record<AnimalAge, AgeRange>>>
> = {
  [AnimalSpecies.CAT]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
  [AnimalSpecies.DOG]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
  [AnimalSpecies.RODENT]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
};
