import isEqual from "lodash.isequal";
import { AnimalBreed } from "./animalBreed";
import { AnimalColor } from "./animalColor";
import { isValidDate } from "./date";
import { sortByLabels } from "./enumUtils";
import { ErrorCode } from "./errors";
import { HostFamily } from "./hostFamily";
import { getImageId, ImageFileOrId } from "./image";
import { SearchFilter } from "./pagination";
import { Query } from "./query";
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
  DECEASED = "DECEASED",
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
  [AnimalStatus.DECEASED]: "Décédé",
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

export const ACTIVE_ANIMAL_STATUS = [
  AnimalStatus.OPEN_TO_ADOPTION,
  AnimalStatus.OPEN_TO_RESERVATION,
  AnimalStatus.RESERVED,
  AnimalStatus.UNAVAILABLE,
];

function isAnimalStatus(value: string): value is AnimalStatus {
  return Object.values(AnimalStatus).includes(value as AnimalStatus);
}

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

export enum AnimalColorEnum {
  BEIGE = "BEIGE",
  BLACK = "BLACK",
  BLACK_AND_WHITE = "BLACK_AND_WHITE",
  BLUE = "BLUE",
  BRINDLE = "BRINDLE",
  BROWN = "BROWN",
  BROWN_AND_WHITE = "BROWN_AND_WHITE",
  CHOCOLATE = "CHOCOLATE",
  CREAM = "CREAM",
  FAWN = "FAWN",
  FAWN_AND_BLACK = "FAWN_AND_BLACK",
  GINGER = "GINGER",
  GINGER_AND_TABBY = "GINGER_AND_TABBY",
  GINGER_AND_WHITE = "GINGER_AND_WHITE",
  GRAY = "GRAY",
  GRAY_AND_TABBY = "GRAY_AND_TABBY",
  GRAY_AND_WHITE = "GRAY_AND_WHITE",
  MERLE_BLUE = "MERLE_BLUE",
  SIAMESE_TYPE = "SIAMESE_TYPE",
  TABBY = "TABBY",
  TORTOISE_SHELL = "TORTOISE_SHELL",
  TRICOLOR = "TRICOLOR",
  WHITE = "WHITE",
  WHITE_AND_TABBY = "WHITE_AND_TABBY",
}

export const AnimalColorLabels: {
  [key in AnimalColorEnum]: string;
} = {
  [AnimalColorEnum.BEIGE]: "Beige",
  [AnimalColorEnum.BLACK]: "Noir",
  [AnimalColorEnum.BLACK_AND_WHITE]: "Noir et blanc",
  [AnimalColorEnum.BLUE]: "Bleu",
  [AnimalColorEnum.BRINDLE]: "Bringé",
  [AnimalColorEnum.BROWN]: "Marron",
  [AnimalColorEnum.BROWN_AND_WHITE]: "Marron et blanc",
  [AnimalColorEnum.CHOCOLATE]: "Chocolat",
  [AnimalColorEnum.CREAM]: "Crème",
  [AnimalColorEnum.FAWN]: "Fauve",
  [AnimalColorEnum.FAWN_AND_BLACK]: "Fauve et noir",
  [AnimalColorEnum.GINGER]: "Roux",
  [AnimalColorEnum.GINGER_AND_TABBY]: "Tigré et roux",
  [AnimalColorEnum.GINGER_AND_WHITE]: "Roux et blanc",
  [AnimalColorEnum.GRAY]: "Gris",
  [AnimalColorEnum.GRAY_AND_TABBY]: "Tigré et gris",
  [AnimalColorEnum.GRAY_AND_WHITE]: "Gris et blanc",
  [AnimalColorEnum.MERLE_BLUE]: "Bleu merle",
  [AnimalColorEnum.SIAMESE_TYPE]: "Typé siamois",
  [AnimalColorEnum.TABBY]: "Tigré",
  [AnimalColorEnum.TORTOISE_SHELL]: "Ecaille de tortue",
  [AnimalColorEnum.TRICOLOR]: "Tricolore",
  [AnimalColorEnum.WHITE]: "Blanc",
  [AnimalColorEnum.WHITE_AND_TABBY]: "Tigré et blanc",
};

export const AnimalColorIds: {
  [key in AnimalColorEnum]: string;
} = {
  [AnimalColorEnum.BEIGE]: "4a4cd32b-d75a-4c92-b996-a38ff92e23d7",
  [AnimalColorEnum.BLACK]: "a0963648-bd50-4c87-bbb9-6cbd25125afd",
  [AnimalColorEnum.BLACK_AND_WHITE]: "0ea94c47-9f66-4f40-ac63-5f4a2bba86c0",
  [AnimalColorEnum.BLUE]: "f4124158-c19d-4a4a-a0f4-854283dd2d41",
  [AnimalColorEnum.BRINDLE]: "81ddeb54-3d5b-4469-81ea-0103e1ba2f41",
  [AnimalColorEnum.BROWN]: "f2545615-f5dd-4696-8f89-d0d65e9d2bc4",
  [AnimalColorEnum.BROWN_AND_WHITE]: "ead50554-173f-4285-a098-9047ed72fed7",
  [AnimalColorEnum.CHOCOLATE]: "4985da86-bd33-4d65-88b0-4854be4283e9",
  [AnimalColorEnum.CREAM]: "11c1ebd0-b3c4-4ee2-90dc-e60e0a05ceb2",
  [AnimalColorEnum.FAWN]: "caefe686-606f-4d46-8700-a60ebd07007b",
  [AnimalColorEnum.FAWN_AND_BLACK]: "8d5c5ff3-2ac8-4e7b-a58c-1a91108e1968",
  [AnimalColorEnum.GINGER]: "72523f5c-e3ef-433e-b12f-b690662b9fd9",
  [AnimalColorEnum.GINGER_AND_TABBY]: "9ab7dfab-8f2a-4c26-a419-e7a3ab277d2d",
  [AnimalColorEnum.GINGER_AND_WHITE]: "ab404ee7-b178-496f-898b-db91cba2f7ad",
  [AnimalColorEnum.GRAY]: "bae9974a-a139-472f-8e6b-00a3bddee41d",
  [AnimalColorEnum.GRAY_AND_TABBY]: "0ac49ac1-cf34-43ca-990e-7f559360fb63",
  [AnimalColorEnum.GRAY_AND_WHITE]: "d87715e8-1c2b-498e-b08b-5f676ad195d5",
  [AnimalColorEnum.MERLE_BLUE]: "0fb7fb76-160c-41d6-b179-7fcd313e441a",
  [AnimalColorEnum.SIAMESE_TYPE]: "b2ef240f-1416-4b35-a453-9d2416f8b0c4",
  [AnimalColorEnum.TABBY]: "4761f37c-cf28-4a0a-9e8e-67d6e8264be6",
  [AnimalColorEnum.TORTOISE_SHELL]: "a0561e4e-1bd4-44d6-bc3a-3e71936de4a2",
  [AnimalColorEnum.TRICOLOR]: "605338ca-5c82-4d9c-8a5e-baff022b6f0f",
  [AnimalColorEnum.WHITE]: "efc89c01-3337-4ca9-ace1-595bb09e68f3",
  [AnimalColorEnum.WHITE_AND_TABBY]: "98490490-71b8-4707-a896-69dd3d8ec20b",
};

export const ANIMAL_COLORS_ORDER = sortByLabels(
  Object.values(AnimalColorEnum),
  AnimalColorLabels
);

export type SearchableAnimal = {
  id: string;
  officialName: string;
  commonName: string;
  birthdate: string;
  pickUpDate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breed?: AnimalBreed | null;
  color?: AnimalColor | null;
  status: AnimalStatus;
  avatarId: string;
  hostFamily?: HostFamily | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

export type DBSearchableAnimal = Omit<
  SearchableAnimal,
  "breed" | "commonName" | "hostFamily" | "color"
> & {
  color?: AnimalColorEnum | null;
  colorId?: string | null;
  commonName?: string | null;
  breedId?: string | null;
  birthdateTimestamp: number;
  pickUpDateTimestamp: number;
  hostFamilyId?: string | null;
};

export type Animal = SearchableAnimal & {
  description: string;
  picturesId: string[];
  comments: string;
};

export function toSearchableAnimal({
  description,
  picturesId,
  comments,
  ...searchableAnimal
}: Animal): SearchableAnimal {
  return searchableAnimal;
}

export type DBAnimal = DBSearchableAnimal & {
  description: string | null;
  picturesId: string[];
  comments?: string | null;
};

export function getAnimalDisplayName(animal: SearchableAnimal) {
  if (animal.commonName !== "") {
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
  description: string;
};

export type CreateAnimalProfilePayload = {
  officialName: string;
  commonName: string;
  birthdate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedId?: string | null;
  colorId?: string | null;
  description: string;
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

  if (!isValidDate(payload.birthdate)) {
    throw new Error(ErrorCode.ANIMAL_INVALID_BIRTHDATE);
  }

  if (payload.gender == null) {
    throw new Error(ErrorCode.ANIMAL_MISSING_GENDER);
  }

  const apiPayload: CreateAnimalProfilePayload = {
    officialName,
    commonName: payload.commonName.trim(),
    birthdate: payload.birthdate,
    gender: payload.gender,
    species: payload.species,
    description: payload.description,
  };

  if (payload.breed != null) {
    if (payload.breed.species !== payload.species) {
      throw new Error(ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH);
    }

    apiPayload.breedId = payload.breed.id;
  }

  if (payload.color != null) {
    apiPayload.colorId = payload.color.id;
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
  comments: string;
};

export type CreateAnimalSituationPayload = {
  status: AnimalStatus;
  pickUpDate: string;
  hostFamilyId?: string | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
  comments: string;
};

export function createAnimalSituationCreationApiPayload(
  payload: AnimalSituationFormPayload
): CreateAnimalSituationPayload {
  if (!isValidDate(payload.pickUpDate)) {
    throw new Error(ErrorCode.ANIMAL_INVALID_PICK_UP_DATE);
  }

  const apiPayload: CreateAnimalSituationPayload = {
    status: payload.status,
    pickUpDate: payload.pickUpDate,
    isOkChildren: payload.isOkChildren,
    isOkDogs: payload.isOkDogs,
    isOkCats: payload.isOkCats,
    isSterilized: payload.isSterilized,
    comments: payload.comments,
  };

  if (payload.hostFamily != null) {
    apiPayload.hostFamilyId = payload.hostFamily.id;
  }

  return apiPayload;
}

export type AnimalPicturesFormPayload = {
  pictures: ImageFileOrId[];
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
    avatarId: getImageId(payload.pictures[0]),
    picturesId: payload.pictures.slice(1).map(getImageId),
  };
}

export type AnimalFormPayload = AnimalProfileFormPayload &
  AnimalSituationFormPayload &
  AnimalPicturesFormPayload;

export type CreateAnimalPayload = CreateAnimalProfilePayload &
  CreateAnimalSituationPayload &
  CreateAnimalPicturesPayload;

export function createAminalCreationApiPayload(
  formPayload: AnimalFormPayload
): CreateAnimalPayload {
  return {
    ...createAnimalProfileCreationApiPayload(formPayload),
    ...createAnimalSituationCreationApiPayload(formPayload),
    ...createAnimalPicturesCreationApiPayload(formPayload),
  };
}

export function createEmptyAnimalFormPayload(): AnimalFormPayload {
  return {
    officialName: "",
    commonName: "",
    birthdate: "",
    gender: null,
    species: null,
    breed: null,
    color: null,
    description: "",
    status: AnimalStatus.UNAVAILABLE,
    pickUpDate: "",
    hostFamily: null,
    isOkChildren: Trilean.UNKNOWN,
    isOkDogs: Trilean.UNKNOWN,
    isOkCats: Trilean.UNKNOWN,
    isSterilized: false,
    comments: "",
    pictures: [],
  };
}

export type UpdateAnimalPayload = Partial<CreateAnimalPayload> & {
  id: string;
};

export function createAminalProfileUpdateApiPayload(
  animal: Animal,
  formPayload: AnimalProfileFormPayload
): UpdateAnimalPayload {
  const updatePayload: UpdateAnimalPayload = {
    id: animal.id,
  };

  if (formPayload.species != null && formPayload.species !== animal.species) {
    updatePayload.species = formPayload.species;
  }

  // Allow null to clear the field.
  if (formPayload.breed?.id !== animal.breed?.id) {
    updatePayload.breedId = formPayload.breed?.id ?? null;
  }

  const officialName = formPayload.officialName.trim();
  if (officialName !== animal.officialName) {
    updatePayload.officialName = officialName;
  }

  const commonName = formPayload.commonName.trim();
  if (commonName !== animal.commonName) {
    updatePayload.commonName = commonName;
  }

  if (formPayload.birthdate !== animal.birthdate) {
    updatePayload.birthdate = formPayload.birthdate;
  }

  if (formPayload.gender != null && formPayload.gender !== animal.gender) {
    updatePayload.gender = formPayload.gender;
  }

  // Allow null to clear the field.
  if (formPayload.color?.id !== animal.color?.id) {
    updatePayload.colorId = formPayload.color?.id ?? null;
  }

  if (formPayload.description !== animal.description) {
    updatePayload.description = formPayload.description;
  }

  return updatePayload;
}

export function createAminalSituationUpdateApiPayload(
  animal: Animal,
  formPayload: AnimalSituationFormPayload
): UpdateAnimalPayload {
  const updatePayload: UpdateAnimalPayload = {
    id: animal.id,
  };

  if (formPayload.status !== animal.status) {
    updatePayload.status = formPayload.status;
  }

  if (formPayload.pickUpDate !== animal.pickUpDate) {
    updatePayload.pickUpDate = formPayload.pickUpDate;
  }

  if (formPayload.hostFamily?.id !== animal.hostFamily?.id) {
    updatePayload.hostFamilyId = formPayload.hostFamily?.id ?? null;
  }

  if (formPayload.isOkCats !== animal.isOkCats) {
    updatePayload.isOkCats = formPayload.isOkCats;
  }

  if (formPayload.isOkChildren !== animal.isOkChildren) {
    updatePayload.isOkChildren = formPayload.isOkChildren;
  }

  if (formPayload.isOkDogs !== animal.isOkDogs) {
    updatePayload.isOkDogs = formPayload.isOkDogs;
  }

  if (formPayload.isSterilized !== animal.isSterilized) {
    updatePayload.isSterilized = formPayload.isSterilized;
  }

  if (formPayload.comments !== animal.comments) {
    updatePayload.comments = formPayload.comments;
  }

  return updatePayload;
}

export function createAminalPicturesUpdateApiPayload(
  animal: Animal,
  formPayload: AnimalPicturesFormPayload
): UpdateAnimalPayload {
  const updatePayload: UpdateAnimalPayload = {
    id: animal.id,
  };

  if (formPayload.pictures.length === 0) {
    throw new Error(ErrorCode.ANIMAL_MISSING_AVATAR);
  }

  const [avatarId, ...picturesId] = formPayload.pictures.map(getImageId);
  if (avatarId !== animal.avatarId) {
    updatePayload.avatarId = avatarId;
  }

  if (!isEqual(picturesId, animal.picturesId)) {
    updatePayload.picturesId = picturesId;
  }

  return updatePayload;
}

export type AnimalFilters = {
  status?: AnimalStatus[] | null;
  hostFamilyId?: string | null;
};

export function getActiveAnimalFiltersCount(filters: AnimalFilters) {
  let activeFiltersCount = 0;

  if (filters.status != null && filters.status.length > 0) {
    activeFiltersCount += 1;
  }

  if (filters.hostFamilyId != null) {
    activeFiltersCount += 1;
  }

  return activeFiltersCount;
}

export type AnimalSearch = SearchFilter & AnimalFilters;

export function hasAnimalSearch({ search, ...filters }: AnimalSearch) {
  return (
    (search != null && search !== "") ||
    getActiveAnimalFiltersCount(filters) > 0
  );
}

export function createAnimalSearchFromQuery(query: Query) {
  const animalSearch: AnimalSearch = {};

  if (query.q != null && typeof query.q === "string") {
    animalSearch.search = query.q;
  }

  if (query.status != null) {
    animalSearch.status = (Array.isArray(query.status)
      ? query.status
      : [query.status]
    ).filter(isAnimalStatus);
  }

  if (query.hostFamilyId != null && typeof query.hostFamilyId === "string") {
    animalSearch.hostFamilyId = query.hostFamilyId;
  }

  return animalSearch;
}

export function createQueryFromAnimalSearch(animalSearch: AnimalSearch) {
  const query: Query = {};

  if (animalSearch.search != null && animalSearch.search !== "") {
    query.q = animalSearch.search;
  }

  if (animalSearch.status != null && animalSearch.status.length > 0) {
    query.status = animalSearch.status;
  }

  if (animalSearch.hostFamilyId != null) {
    query.hostFamilyId = animalSearch.hostFamilyId;
  }

  return query;
}
