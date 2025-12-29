import type { IconName } from "#generated/icon";
import { AdoptionOption } from "@animeaux/prisma";
import orderBy from "lodash.orderby";

export const ADOPTION_OPTION_TRANSLATION: Record<AdoptionOption, string> = {
  [AdoptionOption.WITH_STERILIZATION]: "Avec stérilisation",
  [AdoptionOption.WITHOUT_STERILIZATION]: "Sans stérilisation",
  [AdoptionOption.FREE_DONATION]: "Don libre",
  [AdoptionOption.UNKNOWN]: "Inconnu",
};

export const ADOPTION_OPTION_ICON: Record<AdoptionOption, IconName> = {
  [AdoptionOption.WITH_STERILIZATION]: "icon-scissors-solid",
  [AdoptionOption.WITHOUT_STERILIZATION]: "icon-scissors-solid",
  [AdoptionOption.FREE_DONATION]: "icon-hand-holding-euro-solid",
  [AdoptionOption.UNKNOWN]: "icon-circle-question-solid",
};

export const SORTED_ADOPTION_OPTION = orderBy(
  Object.values(AdoptionOption),
  (adoptionOption) => ADOPTION_OPTION_TRANSLATION[adoptionOption],
);
