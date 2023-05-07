import { Animal, Status } from "@prisma/client";
import { AlgoliaClient } from "../core/algolia";

export const ANIMAL_INDEX_NAME = "animals";

export const AnimalIndex = AlgoliaClient.initIndex(ANIMAL_INDEX_NAME);

export type AnimalFromAlgolia = Pick<
  Animal,
  "name" | "alias" | "species" | "status" | "pickUpLocation"
> & {
  pickUpDate: number;
};

export function getDisplayName(animal: Pick<Animal, "name" | "alias">) {
  if (animal.alias != null && animal.alias !== "") {
    return `${animal.name} (${animal.alias})`;
  }

  return animal.name;
}

/** LOST, OPEN_TO_ADOPTION, OPEN_TO_RESERVATION, RESERVED, RETIRED, UNAVAILABLE */
export const ACTIVE_ANIMAL_STATUS: Status[] = [
  Status.LOST,
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
  Status.RESERVED,
  Status.RETIRED,
  Status.UNAVAILABLE,
];

/** ADOPTED, FREE */
export const SAVED_ANIMAL_STATUS: Status[] = [Status.ADOPTED, Status.FREE];

/** ADOPTED, DECEASED, FREE, RETURNED */
export const NON_ACTIVE_ANIMAL_STATUS: Status[] = [
  Status.ADOPTED,
  Status.DECEASED,
  Status.FREE,
  Status.RETURNED,
];

/** OPEN_TO_ADOPTION, OPEN_TO_RESERVATION */
export const ADOPTABLE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
];
