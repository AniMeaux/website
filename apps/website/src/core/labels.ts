import { AnimalAge, AnimalGender, AnimalSpecies } from "@animeaux/shared";

export const ANIMAL_SPECIES_LABELS: Record<AnimalSpecies, string> = {
  [AnimalSpecies.BIRD]: "Oiseau",
  [AnimalSpecies.CAT]: "Chat",
  [AnimalSpecies.DOG]: "Chien",
  [AnimalSpecies.REPTILE]: "Reptile",
  [AnimalSpecies.RODENT]: "Rongeur",
};

export const ANIMAL_SPECIES_LABELS_PLURAL: Record<AnimalSpecies, string> = {
  [AnimalSpecies.BIRD]: "Oiseaux",
  [AnimalSpecies.CAT]: "Chats",
  [AnimalSpecies.DOG]: "Chiens",
  [AnimalSpecies.REPTILE]: "Reptiles",
  [AnimalSpecies.RODENT]: "Rongeurs",
};

export const ANIMAL_AGES_LABELS: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
};

export const ANIMAL_GENDER_LABELS: Record<AnimalGender, string> = {
  [AnimalGender.FEMALE]: "Femelle",
  [AnimalGender.MALE]: "Mâle",
};
