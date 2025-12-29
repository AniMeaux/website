import { Species } from "@animeaux/prisma";
import { DateTime } from "luxon";

export enum AnimalAge {
  JUNIOR = "JUNIOR",
  ADULT = "ADULT",
  SENIOR = "SENIOR",
}

type AgeRange = {
  minMonths: number;
  maxMonths: number;
};

// 100 years
const MAX_ANIMAL_MONTHS = 100 * 12;

// `maxMonths` is excluded.
export const ANIMAL_AGE_RANGE_BY_SPECIES: Partial<
  Record<Species, Partial<Record<AnimalAge, AgeRange>>>
> = {
  [Species.CAT]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
  [Species.DOG]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: 9 * 12 },
    [AnimalAge.SENIOR]: { minMonths: 9 * 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
  [Species.RODENT]: {
    [AnimalAge.JUNIOR]: { minMonths: 0, maxMonths: 12 },
    [AnimalAge.ADULT]: { minMonths: 12, maxMonths: MAX_ANIMAL_MONTHS },
  },
};

// 6 mois
// 1 an
// 3 ans
export function formatAge(birthday: string) {
  const ageInMonths = DateTime.now().diff(DateTime.fromISO(birthday), [
    "months",
  ]).months;

  if (ageInMonths >= 12) {
    const ageInYears = Math.floor(ageInMonths / 12);
    return ageInYears === 1 ? "1 an" : `${ageInYears} ans`;
  }

  return `${Math.floor(ageInMonths)} mois`;
}
