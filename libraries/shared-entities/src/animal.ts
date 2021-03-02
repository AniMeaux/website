import { v4 as uuid } from "uuid";
import { AnimalBreed } from "./animalBreed";
import { DATE_PATTERN } from "./date";
import { sortByLabels } from "./enumUtils";
import { ErrorCode } from "./errors";
import { HostFamily } from "./hostFamily";
import { ImageFile } from "./image";
import { Trilean } from "./trilean";

export enum AnimalSpecies {
  BIRD = "BIRD",
  CAT = "CAT",
  DOG = "DOG",
  REPTILE = "REPTILE",
  RODENT = "RODENT",
}

export const AnimalSpeciesLabels: {
  [key in AnimalSpecies]: string;
} = {
  [AnimalSpecies.BIRD]: "Oiseau",
  [AnimalSpecies.CAT]: "Chat",
  [AnimalSpecies.DOG]: "Chien",
  [AnimalSpecies.REPTILE]: "Reptile",
  [AnimalSpecies.RODENT]: "Rongeur",
};

export const AnimalSpeciesLabelsPlural: {
  [key in AnimalSpecies]: string;
} = {
  [AnimalSpecies.BIRD]: "Oiseaux",
  [AnimalSpecies.CAT]: "Chats",
  [AnimalSpecies.DOG]: "Chiens",
  [AnimalSpecies.REPTILE]: "Reptiles",
  [AnimalSpecies.RODENT]: "Rongeurs",
};

export const ANIMAL_SPECIES_ALPHABETICAL_ORDER = sortByLabels(
  Object.values(AnimalSpecies),
  AnimalSpeciesLabels
);

export function isAnimalSpeciesFertile(
  animalSpecies: AnimalSpecies
): animalSpecies is
  | AnimalSpecies.CAT
  | AnimalSpecies.DOG
  | AnimalSpecies.RODENT {
  return [AnimalSpecies.CAT, AnimalSpecies.DOG, AnimalSpecies.RODENT].includes(
    animalSpecies
  );
}

export enum AnimalAge {
  JUNIOR = "JUNIOR",
  ADULT = "ADULT",
  SENIOR = "SENIOR",
}

// Youngest to oldest.
export const ANIMAL_AGES_ORDER = [
  AnimalAge.JUNIOR,
  AnimalAge.ADULT,
  AnimalAge.SENIOR,
];

export const AnimalAgesLabels: {
  [key in AnimalAge]: string;
} = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
};

export type AgeRange = {
  minMonths?: number;
  maxMonths?: number;
};

// `maxMonths` is excluded.
export const AnimalAgeRangeBySpecies: {
  [key in AnimalSpecies]?: {
    [key in AnimalAge]?: AgeRange;
  };
} = {
  [AnimalSpecies.CAT]: {
    [AnimalAge.JUNIOR]: { maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12 },
  },
  [AnimalSpecies.DOG]: {
    [AnimalAge.JUNIOR]: { maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12 },
  },
  [AnimalSpecies.RODENT]: {
    [AnimalAge.JUNIOR]: { maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12 },
  },
};

export enum AnimalStatus {
  ADOPTED = "ADOPTED",
  FREE = "FREE",
  OPEN_TO_ADOPTION = "OPEN_TO_ADOPTION",
  OPEN_TO_RESERVATION = "OPEN_TO_RESERVATION",
  RESERVED = "RESERVED",
  UNAVAILABLE = "UNAVAILABLE",
}

export const AnimalStatusLabels: {
  [key in AnimalStatus]: string;
} = {
  [AnimalStatus.ADOPTED]: "Adopté",
  [AnimalStatus.FREE]: "Libre",
  [AnimalStatus.OPEN_TO_ADOPTION]: "Adoptable",
  [AnimalStatus.OPEN_TO_RESERVATION]: "Réservable",
  [AnimalStatus.RESERVED]: "Réservé",
  [AnimalStatus.UNAVAILABLE]: "Indisponible",
};

export const ANIMAL_STATUSES_ORDER = sortByLabels(
  Object.values(AnimalStatus),
  AnimalStatusLabels
);

export enum AnimalGender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export const AnimalGenderLabels: {
  [key in AnimalGender]: string;
} = {
  [AnimalGender.FEMALE]: "Femelle",
  [AnimalGender.MALE]: "Mâle",
};

export const ANIMAL_GENDERS_ORDER = sortByLabels(
  Object.values(AnimalGender),
  AnimalGenderLabels
);

export enum AnimalColor {
  BEIGE = "BEIGE",
  WHITE = "WHITE",
  BLUE = "BLUE",
  MERLE_BLUE = "MERLE_BLUE",
  BRINDLE = "BRINDLE",
  CHOCOLATE = "CHOCOLATE",
  CREAM = "CREAM",
  TORTOISE_SHELL = "TORTOISE_SHELL",
  FAWN = "FAWN",
  GRAY = "GRAY",
  GRAY_AND_WHITE = "GRAY_AND_WHITE",
  BROWN = "BROWN",
  BROWN_AND_WHITE = "BROWN_AND_WHITE",
  BLACK = "BLACK",
  BLACK_AND_WHITE = "BLACK_AND_WHITE",
  GINGER = "GINGER",
  GINGER_AND_WHITE = "GINGER_AND_WHITE",
  TABBY = "TABBY",
  WHITE_AND_TABBY = "WHITE_AND_TABBY",
  GRAY_AND_TABBY = "GRAY_AND_TABBY",
  GINGER_AND_TABBY = "GINGER_AND_TABBY",
  TRICOLOR = "TRICOLOR",
}

export const AnimalColorLabels: {
  [key in AnimalColor]: string;
} = {
  [AnimalColor.BEIGE]: "Beige",
  [AnimalColor.WHITE]: "Blanc",
  [AnimalColor.BLUE]: "Bleu",
  [AnimalColor.MERLE_BLUE]: "Bleu merle",
  [AnimalColor.BRINDLE]: "Bringé",
  [AnimalColor.CHOCOLATE]: "Chocolat",
  [AnimalColor.CREAM]: "Crème",
  [AnimalColor.TORTOISE_SHELL]: "Ecaille de tortue",
  [AnimalColor.FAWN]: "Fauve",
  [AnimalColor.GRAY]: "Gris",
  [AnimalColor.GRAY_AND_WHITE]: "Gris et blanc",
  [AnimalColor.BROWN]: "Marron",
  [AnimalColor.BROWN_AND_WHITE]: "Marron et blanc",
  [AnimalColor.BLACK]: "Noir",
  [AnimalColor.BLACK_AND_WHITE]: "Noir et blanc",
  [AnimalColor.GINGER]: "Roux",
  [AnimalColor.GINGER_AND_WHITE]: "Roux et blanc",
  [AnimalColor.TABBY]: "Tigré",
  [AnimalColor.WHITE_AND_TABBY]: "Tigré et blanc",
  [AnimalColor.GRAY_AND_TABBY]: "Tigré et gris",
  [AnimalColor.GINGER_AND_TABBY]: "Tigré et roux",
  [AnimalColor.TRICOLOR]: "Tricolore",
};

export const ANIMAL_COLORS_ORDER = sortByLabels(
  Object.values(AnimalColor),
  AnimalColorLabels
);

export type SearchableAnimal = {
  id: string;
  officialName: string;
  commonName?: string | null;
  birthdate: string;
  pickUpDate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breed?: AnimalBreed | null;
  color?: AnimalColor | null;
  status: AnimalStatus;
  avatarId: string;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

export type DBSearchableAnimal = Omit<SearchableAnimal, "breed"> & {
  breedId?: string | null;
  birthdateTimestamp: number;
  pickUpDateTimestamp?: number | null;
};

export type Animal = SearchableAnimal & {
  picturesId: string[];
  hostFamily?: HostFamily | null;
};

export type DBAnimal = DBSearchableAnimal & {
  picturesId: string[];
  hostFamilyId?: string | null;
};

export function getAnimalDisplayName(animal: SearchableAnimal) {
  if (animal.commonName != null) {
    return `${animal.officialName} (${animal.commonName})`;
  }

  return animal.officialName;
}

export type AnimalProfileFormPayload = {
  officialName: string;
  commonName: string;
  birthdate: string;
  gender: AnimalGender | null;
  species: AnimalSpecies | null;
  breed: AnimalBreed | null;
  color: AnimalColor | null;
};

export type CreateAnimalProfilePayload = {
  officialName: string;
  commonName?: string | null;
  birthdate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedId?: string | null;
  color?: AnimalColor | null;
};

export function createAnimalProfileCreationApiPayload(
  payload: AnimalProfileFormPayload
): CreateAnimalProfilePayload {
  if (payload.species == null) {
    throw new Error(ErrorCode.ANIMAL_MISSING_SPECIES);
  }

  const officialName = payload.officialName.trim();
  if (officialName === "") {
    throw new Error(ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME);
  }

  if (!DATE_PATTERN.test(payload.birthdate)) {
    throw new Error(ErrorCode.ANIMAL_INVALID_BIRTHDATE);
  }

  if (payload.gender == null) {
    throw new Error(ErrorCode.ANIMAL_MISSING_GENDER);
  }

  const apiPayload: CreateAnimalProfilePayload = {
    officialName,
    birthdate: payload.birthdate,
    gender: payload.gender,
    species: payload.species,
  };

  const commonName = payload.commonName.trim();
  if (commonName !== "") {
    apiPayload.commonName = commonName;
  }

  if (payload.breed != null) {
    if (payload.breed.species !== payload.species) {
      throw new Error(ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH);
    }

    apiPayload.breedId = payload.breed.id;
  }

  if (payload.color != null) {
    apiPayload.color = payload.color;
  }

  return apiPayload;
}

export type AnimalSituationFormPayload = {
  status: AnimalStatus;
  pickUpDate: string;
  hostFamily: HostFamily | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

export type CreateAnimalSituationPayload = {
  status: AnimalStatus;
  pickUpDate: string;
  hostFamilyId?: string | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

export function createAnimalSituationCreationApiPayload(
  payload: AnimalSituationFormPayload
): CreateAnimalSituationPayload {
  if (!DATE_PATTERN.test(payload.pickUpDate)) {
    throw new Error(ErrorCode.ANIMAL_INVALID_PICK_UP_DATE);
  }

  const apiPayload: CreateAnimalSituationPayload = {
    status: payload.status,
    pickUpDate: payload.pickUpDate,
    isOkChildren: payload.isOkChildren,
    isOkDogs: payload.isOkDogs,
    isOkCats: payload.isOkCats,
    isSterilized: payload.isSterilized,
  };

  if (payload.hostFamily != null) {
    apiPayload.hostFamilyId = payload.hostFamily.id;
  }

  return apiPayload;
}

export type AnimalPicturesFormPayload = {
  pictures: ImageFile[];
};

export type CreateAnimalPicturesPayload = {
  avatarId: string;
  picturesId: string[];
};

export function createAnimalPicturesCreationApiPayload(
  payload: AnimalPicturesFormPayload
): CreateAnimalPicturesPayload {
  if (payload.pictures.length === 0) {
    throw new Error(ErrorCode.ANIMAL_MISSING_AVATAR);
  }

  return {
    avatarId: payload.pictures[0].id,
    picturesId: payload.pictures.slice(1).map((picture) => picture.id),
  };
}

export type AnimalFormPayload = AnimalProfileFormPayload &
  AnimalSituationFormPayload &
  AnimalPicturesFormPayload;

export type CreateAnimalPayload = CreateAnimalProfilePayload &
  CreateAnimalSituationPayload &
  CreateAnimalPicturesPayload & {
    id: string;
  };

export function createAminalCreationApiPayload(
  formPayload: AnimalFormPayload
): CreateAnimalPayload {
  return {
    id: uuid(),
    ...createAnimalProfileCreationApiPayload(formPayload),
    ...createAnimalSituationCreationApiPayload(formPayload),
    ...createAnimalPicturesCreationApiPayload(formPayload),
  };
}

export type UpdateAnimalPayload = Partial<CreateAnimalPayload> & {
  id: string;
};
