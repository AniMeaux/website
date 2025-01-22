import { isDefined } from "#core/is-defined";
import type { IconName } from "#generated/icon";
import type { Animal, Breed, Color } from "@prisma/client";
import { Species } from "@prisma/client";
import orderBy from "lodash.orderby";

export const SPECIES_TRANSLATION: Record<Species, string> = {
  [Species.BIRD]: "Oiseau",
  [Species.CAT]: "Chat",
  [Species.DOG]: "Chien",
  [Species.REPTILE]: "Reptile",
  [Species.RODENT]: "PAC",
};

export const SPECIES_ICON: Record<Species, IconName> = {
  [Species.BIRD]: "icon-bird-solid",
  [Species.CAT]: "icon-cat-solid",
  [Species.DOG]: "icon-dog-solid",
  [Species.REPTILE]: "icon-turtle-solid",
  [Species.RODENT]: "icon-rabbit-solid",
};

export const SORTED_SPECIES = orderBy(
  Object.values(Species),
  (species) => SPECIES_TRANSLATION[species],
);

export function getSpeciesLabels(
  animal: Pick<Animal, "species"> & {
    breed: null | Pick<Breed, "name">;
    color: null | Pick<Color, "name">;
  },
) {
  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ].filter(isDefined);

  return speciesLabels.join(" • ");
}
