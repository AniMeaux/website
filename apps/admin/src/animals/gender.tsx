import { Gender } from "@prisma/client";
import orderBy from "lodash.orderby";
import { IconProps } from "~/generated/icon";

export const GENDER_TRANSLATION: Record<Gender, string> = {
  [Gender.FEMALE]: "Femelle",
  [Gender.MALE]: "Mâle",
};

export const GENDER_ICON: Record<Gender, IconProps["id"]> = {
  [Gender.FEMALE]: "venus",
  [Gender.MALE]: "mars",
};

export const SORTED_GENDERS = orderBy(
  Object.values(Gender),
  (gender) => GENDER_TRANSLATION[gender]
);
