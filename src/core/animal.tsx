export enum AnimalSpecies {
  BIRD = "BIRD",
  CAT = "CAT",
  DOG = "DOG",
  REPTILE = "REPTILE",
  RODENT = "RODENT",
}

export const ANIMAL_SPECIES_ORDER_ALPHABETICAL = Object.values(
  AnimalSpecies
).sort();

export const AnimalSpeciesLabels: {
  [key in AnimalSpecies]: string;
} = {
  BIRD: "Oiseau",
  CAT: "Chat",
  DOG: "Chien",
  REPTILE: "Reptile",
  RODENT: "Rongeur",
};
