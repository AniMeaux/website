import { orderEnumBy } from "@animeaux/core"
import { Gender, ScreeningResult } from "@animeaux/prisma"

import type { IconName } from "#i/generated/icon.js"

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
}

export const SCREENING_RESULT_ICON: Record<ScreeningResult, IconName> = {
  [ScreeningResult.NEGATIVE]: "icon-virus-slash-solid",
  [ScreeningResult.POSITIVE]: "icon-virus-solid",
  [ScreeningResult.UNKNOWN]: "icon-circle-question-solid",
}

export const SORTED_SCREENING_RESULTS = orderEnumBy(
  Object.values(ScreeningResult),
  (result) => SCREENING_RESULT_TRANSLATION[result][Gender.MALE],
)
