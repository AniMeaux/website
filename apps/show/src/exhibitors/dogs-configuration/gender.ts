import { orderEnumBy } from "@animeaux/core"
import { Gender } from "@animeaux/prisma"

export const GENDER_TRANSLATION: Record<Gender, string> = {
  [Gender.FEMALE]: "Femelle",
  [Gender.MALE]: "Mâle",
}

export const SORTED_GENDERS = orderEnumBy(
  Object.values(Gender),
  (gender) => GENDER_TRANSLATION[gender],
)
