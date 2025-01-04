import { Gender } from "@prisma/client";
import orderBy from "lodash.orderby";

export const GENDER_TRANSLATION: Record<Gender, string> = {
  [Gender.FEMALE]: "Femelle",
  [Gender.MALE]: "Mâle",
};

export const SORTED_GENDERS = orderBy(
  Object.values(Gender),
  (gender) => GENDER_TRANSLATION[gender],
);
