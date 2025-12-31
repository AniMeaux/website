import type { IconProps } from "#i/generated/icon";
import { Species } from "@animeaux/prisma";

export const SPECIES_ICON: Record<Species, IconProps["id"]> = {
  [Species.BIRD]: "bird",
  [Species.CAT]: "cat",
  [Species.DOG]: "dog",
  [Species.REPTILE]: "turtle",
  [Species.RODENT]: "rabbit",
};
