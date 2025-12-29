import { AnimalAge } from "@animeaux/core";
import { Gender, Species } from "@animeaux/prisma";

export const SPECIES_TRANSLATION: Record<Species, string> = {
  [Species.BIRD]: "oiseau",
  [Species.CAT]: "chat",
  [Species.DOG]: "chien",
  [Species.REPTILE]: "reptile",
  [Species.RODENT]: "PAC",
};

export const SPECIES_PLURAL_TRANSLATION: Record<Species, string> = {
  [Species.BIRD]: "oiseaux",
  [Species.CAT]: "chats",
  [Species.DOG]: "chiens",
  [Species.REPTILE]: "reptiles",
  [Species.RODENT]: "PACs",
};

export const SPECIES_TRANSLATION_STANDALONE: Record<Species, string> = {
  [Species.BIRD]: "Oiseau",
  [Species.CAT]: "Chat",
  [Species.DOG]: "Chien",
  [Species.REPTILE]: "Reptile",
  [Species.RODENT]: "PAC",
};

export const SPECIES_PLURAL_TRANSLATION_STANDALONE: Record<Species, string> = {
  [Species.BIRD]: "Oiseaux",
  [Species.CAT]: "Chats",
  [Species.DOG]: "Chiens",
  [Species.REPTILE]: "Reptiles",
  [Species.RODENT]: "PACs",
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
