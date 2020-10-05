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

export const ANIMAL_SPECIES_ORDER_ALPHABETICAL = [
  AnimalSpecies.CAT,
  AnimalSpecies.DOG,
  AnimalSpecies.BIRD,
  AnimalSpecies.REPTILE,
  AnimalSpecies.RODENT,
];

export enum AnimalAge {
  BABY = "BABY",
  YOUNG = "YOUNG",
  ADULT = "ADULT",
  SENIOR = "SENIOR",
}

export const ANIMAL_AGES_ORDER = [
  AnimalAge.BABY,
  AnimalAge.YOUNG,
  AnimalAge.ADULT,
  AnimalAge.SENIOR,
];

export const AnimalAgesLabels: {
  [key in AnimalAge]: string;
} = {
  BABY: "Bébé",
  YOUNG: "Jeune",
  ADULT: "Adulte",
  SENIOR: "Sénior",
};
