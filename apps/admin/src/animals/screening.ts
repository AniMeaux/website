import type { IconName } from "#generated/icon";
import { Gender, ScreeningResult } from "@prisma/client";
import orderBy from "lodash.orderby";

export const SCREENING_RESULT_TRANSLATION: Record<
  ScreeningResult,
  Record<Gender, string>
> = {
  [ScreeningResult.NEGATIVE]: {
    [Gender.FEMALE]: "Négative",
    [Gender.MALE]: "Négatif",
  },
  [ScreeningResult.POSITIVE]: {
    [Gender.FEMALE]: "Positive",
    [Gender.MALE]: "Positif",
  },
  [ScreeningResult.UNKNOWN]: {
    [Gender.FEMALE]: "Inconnu",
    [Gender.MALE]: "Inconnu",
  },
};

export const SCREENING_RESULT_ICON: Record<ScreeningResult, IconName> = {
  [ScreeningResult.NEGATIVE]: "icon-virus-slash",
  [ScreeningResult.POSITIVE]: "icon-virus",
  [ScreeningResult.UNKNOWN]: "icon-circle-question",
};

export const SORTED_SCREENING_RESULTS = orderBy(
  Object.values(ScreeningResult),
  (result) => SCREENING_RESULT_TRANSLATION[result][Gender.MALE],
);
