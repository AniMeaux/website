import type { IconProps } from "#generated/icon";
import { AdoptionOption } from "@prisma/client";
import orderBy from "lodash.orderby";

export const ADOPTION_OPTION_TRANSLATION: Record<AdoptionOption, string> = {
  [AdoptionOption.WITH_STERILIZATION]: "Avec stérilisation",
  [AdoptionOption.WITHOUT_STERILIZATION]: "Sans stérilisation",
  [AdoptionOption.FREE_DONATION]: "Don libre",
  [AdoptionOption.UNKNOWN]: "Inconnu",
};

export const ADOPTION_OPTION_ICON: Record<AdoptionOption, IconProps["id"]> = {
  [AdoptionOption.WITH_STERILIZATION]: "scissors",
  [AdoptionOption.WITHOUT_STERILIZATION]: "scissors",
  [AdoptionOption.FREE_DONATION]: "hand-holding-euro",
  [AdoptionOption.UNKNOWN]: "circle-question",
};

export const SORTED_ADOPTION_OPTION = orderBy(
  Object.values(AdoptionOption),
  (adoptionOption) => ADOPTION_OPTION_TRANSLATION[adoptionOption],
);
