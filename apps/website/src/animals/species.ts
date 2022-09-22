import { Species } from "@prisma/client";
import { IconId } from "~/generated/icon";

export const SPECIES_ICON: Record<Species, IconId> = {
  [Species.BIRD]: "bird",
  [Species.CAT]: "cat",
  [Species.DOG]: "dog",
  [Species.REPTILE]: "turtle",
  [Species.RODENT]: "rabbit",
};
