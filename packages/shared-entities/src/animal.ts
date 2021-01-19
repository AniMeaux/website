import { sortByLabels } from "./enumUtils";

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
  BIRD: "Oiseau",
  CAT: "Chat",
  DOG: "Chien",
  REPTILE: "Reptile",
  RODENT: "Rongeur",
};

export const ANIMAL_SPECIES_ALPHABETICAL_ORDER = sortByLabels(
  Object.keys(AnimalSpecies) as AnimalSpecies[],
  AnimalSpeciesLabels
);

export enum AnimalAge {
  JUNIOR = "JUNIOR",
  ADULT = "ADULT",
  SENIOR = "SENIOR",
}

export const ANIMAL_AGES_ORDER = [
  AnimalAge.JUNIOR,
  AnimalAge.ADULT,
  AnimalAge.SENIOR,
];

export const AnimalAgesLabels: {
  [key in AnimalAge]: string;
} = {
  JUNIOR: "Junior",
  ADULT: "Adulte",
  SENIOR: "Sénior",
};

export enum AnimalStatus {
  ADOPTED = "ADOPTED",
  FREE = "FREE",
  OPEN_TO_ADOPTION = "OPEN_TO_ADOPTION",
  OPEN_TO_RESERVATION = "OPEN_TO_RESERVATION",
  UNAVAILABLE = "UNAVAILABLE",
}
