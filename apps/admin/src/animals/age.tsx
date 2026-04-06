import { AnimalAge, orderEnumBy } from "@animeaux/core"

import type { IconName } from "#i/generated/icon.js"

export const SORTED_AGES = orderEnumBy(Object.values(AnimalAge), (age) =>
  age === AnimalAge.JUNIOR ? 0 : age === AnimalAge.ADULT ? 1 : 2,
)

export const AGE_ICON: Record<AnimalAge, IconName> = {
  [AnimalAge.JUNIOR]: "icon-circle-progress-1-solid",
  [AnimalAge.ADULT]: "icon-circle-progress-2-solid",
  [AnimalAge.SENIOR]: "icon-circle-progress-3-solid",
}

export const AGE_TRANSLATION: Record<AnimalAge, string> = {
  [AnimalAge.JUNIOR]: "Junior",
  [AnimalAge.ADULT]: "Adulte",
  [AnimalAge.SENIOR]: "Sénior",
}
