import { Gender } from "@animeaux/prisma"
import orderBy from "lodash.orderby"

import type { IconName } from "#i/generated/icon.js"

export const GENDER_TRANSLATION: Record<Gender, string> = {
  [Gender.FEMALE]: "Femelle",
  [Gender.MALE]: "Mâle",
}

export const GENDER_ICON: Record<Gender, { light: IconName; solid: IconName }> =
  {
    [Gender.FEMALE]: {
      light: "icon-venus-light",
      solid: "icon-venus-solid",
    },
    [Gender.MALE]: {
      light: "icon-mars-light",
      solid: "icon-mars-solid",
    },
  }

export const SORTED_GENDERS = orderBy(
  Object.values(Gender),
  (gender) => GENDER_TRANSLATION[gender],
)
