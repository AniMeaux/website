import { Species } from "@prisma/client";
import orderBy from "lodash.orderby";
import { IconProps } from "~/generated/icon";

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
