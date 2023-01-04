import { AdoptionOption } from "@prisma/client";
import orderBy from "lodash.orderby";

export const ADOPTION_OPTION_TRANSLATION: Record<AdoptionOption, string> = {
  [AdoptionOption.WITH_STERILIZATION]: "Avec stérilisation",
  [AdoptionOption.WITHOUT_STERILIZATION]: "Sans stérilisation",
  [AdoptionOption.FREE_DONATION]: "Don libre",
  [AdoptionOption.UNKNOWN]: "Inconnu",
};

export const SORTED_ADOPTION_OPTION = orderBy(
  Object.values(AdoptionOption),
  (adoptionOption) => ADOPTION_OPTION_TRANSLATION[adoptionOption]
);
