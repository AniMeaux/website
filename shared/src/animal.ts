import {
  AdoptionOption,
  Gender,
  PickUpReason,
  Species,
  Status,
} from "@prisma/client";
import { AnimalBreed } from "./animalBreed";
import { AnimalColor } from "./animalColor";
import {
  OperationPaginationParams,
  OperationPaginationResult,
} from "./operationPagination";
import { Trilean } from "./trilean";

export { Species as AnimalSpecies };
export { Gender as AnimalGender };
export { Status as AnimalStatus };
export { AdoptionOption };
export { PickUpReason };

export const ALL_ANIMAL_SPECIES = Object.values(Species);
export const ALL_ANIMAL_STATUSES = Object.values(Status);

export enum AnimalAge {
  JUNIOR = "JUNIOR",
  ADULT = "ADULT",
  SENIOR = "SENIOR",
}

export type AnimalActiveBrief = {
  id: string;
  displayName: string;
  avatarId: string;
  status: Status;
  managerName?: string;
};

export type PublicAnimalSearchHit = {
  id: string;
  displayName: string;
  avatarId: string;
  birthdate: string;
  gender: Gender;
  breedName?: string;
  colorName?: string;
};

export type AnimalSearchHit = {
  id: string;
  displayName: string;
  highlightedDisplayName: string;
  avatarId: string;
  status: Status;
};

export type PublicAnimal = {
  id: string;
  displayName: string;
  avatarId: string;
  picturesId: string[];
  birthdate: string;
  gender: Gender;
  species: Species;
  breedName?: string;
  colorName?: string;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
  description?: string;
  location?: string;
};

export type Animal = {
  id: string;
  officialName: string;
  commonName?: string;
  displayName: string;
  birthdate: string;
  gender: Gender;
  species: Species;
  breed?: AnimalBreed;
  color?: AnimalColor;
  description?: string;
  avatarId: string;
  picturesId: string[];
  pickUpDate: string;
  pickUpLocation?: string;
  pickUpReason: PickUpReason;
  status: Status;
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
  gender: Gender;
  species: Species;
  breedId: string | null;
  colorId: string | null;
  description: string | null;
  iCadNumber: string | null;
};

export type AnimalSituationInput = {
  status: Status;
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
      species?: Species;
      age?: AnimalAge;
    }
  ): OperationPaginationResult<PublicAnimalSearchHit>;

  searchAnimals: (
    params: OperationPaginationParams & {
      search: string;
      species?: Species[];
      status?: Status[];
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
  Record<Species, Partial<Record<AnimalAge, AgeRange>>>
> = {
  [Species.CAT]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
  [Species.DOG]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
  [Species.RODENT]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
};
