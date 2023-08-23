import { isDefined } from "#core/isDefined.ts";
import { IconProps } from "#generated/icon.tsx";
import { Animal, Breed, Color, Species } from "@prisma/client";
import orderBy from "lodash.orderby";

export const SPECIES_TRANSLATION: Record<Species, string> = {
  [Species.BIRD]: "Oiseau",
  [Species.CAT]: "Chat",
  [Species.DOG]: "Chien",
  [Species.REPTILE]: "Reptile",
  [Species.RODENT]: "Rongeur",
};

export const SPECIES_ICON: Record<Species, IconProps["id"]> = {
  [Species.BIRD]: "bird",
  [Species.CAT]: "cat",
  [Species.DOG]: "dog",
  [Species.REPTILE]: "turtle",
  [Species.RODENT]: "rabbit",
};

export const SORTED_SPECIES = orderBy(
  Object.values(Species),
  (species) => SPECIES_TRANSLATION[species]
);

export function getSpeciesLabels(
  animal: Pick<Animal, "species"> & {
    breed: null | Pick<Breed, "name">;
    color: null | Pick<Color, "name">;
  }
) {
  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ].filter(isDefined);

  return speciesLabels.join(" • ");
}
