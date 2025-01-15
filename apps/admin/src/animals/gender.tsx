import type { IconName } from "#generated/icon";
import { Gender } from "@prisma/client";
import orderBy from "lodash.orderby";

export const GENDER_TRANSLATION: Record<Gender, string> = {
  [Gender.FEMALE]: "Femelle",
  [Gender.MALE]: "Mâle",
};

export const GENDER_ICON: Record<Gender, IconName> = {
  [Gender.FEMALE]: "icon-venus-solid",
  [Gender.MALE]: "icon-mars-solid",
};

export const SORTED_GENDERS = orderBy(
  Object.values(Gender),
  (gender) => GENDER_TRANSLATION[gender],
);
