import { AnimalAge } from "@animeaux/shared";
import { Gender, Species } from "@prisma/client";

export const SPECIES_TRANSLATION: Record<Species, string> = {
  [Species.BIRD]: "Oiseau",
  [Species.CAT]: "Chat",
  [Species.DOG]: "Chien",
  [Species.REPTILE]: "Reptile",
  [Species.RODENT]: "Rongeur",
};

export const SPECIES_PLURAL_TRANSLATION: Record<Species, string> = {
  [Species.BIRD]: "Oiseaux",
  [Species.CAT]: "Chats",
  [Species.DOG]: "Chiens",
  [Species.REPTILE]: "Reptiles",
  [Species.RODENT]: "Rongeurs",
};

export const AGE_TRANSLATION: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
};

export const AGE_PLURAL_TRANSLATION: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Juniors",
  [AnimalAge.ADULT]: "Adultes",
  [AnimalAge.SENIOR]: "Séniors",
};

export const GENDER_TRANSLATION: Record<Gender, string> = {
  [Gender.FEMALE]: "Femelle",
  [Gender.MALE]: "Mâle",
};
