import { Diagnosis, Gender } from "@animeaux/prisma/client";

export const SORTED_DIAGNOSIS = [
  Diagnosis.UNKNOWN,
  Diagnosis.NOT_APPLICABLE,
  Diagnosis.CATEGORIZED,
  Diagnosis.UNCATEGORIZED,
];

export const DIAGNOSIS_TRANSLATION: Record<
  Diagnosis,
  Record<Gender, string>
> = {
  [Diagnosis.CATEGORIZED]: {
    [Gender.FEMALE]: "Catégorisée",
    [Gender.MALE]: "Catégorisé",
  },
  [Diagnosis.NOT_APPLICABLE]: {
    [Gender.FEMALE]: "Non applicable",
    [Gender.MALE]: "Non applicable",
  },
  [Diagnosis.UNCATEGORIZED]: {
    [Gender.FEMALE]: "Non catégorisée",
    [Gender.MALE]: "Non catégorisé",
  },
  [Diagnosis.UNKNOWN]: {
    [Gender.FEMALE]: "À faire",
    [Gender.MALE]: "À faire",
  },
};
