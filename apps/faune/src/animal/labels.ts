import { AdoptionOption } from "@animeaux/shared";

export const ADOPTION_OPTION_LABELS: Record<AdoptionOption, string> = {
  [AdoptionOption.WITH_STERILIZATION]: "Avec stérilisation",
  [AdoptionOption.WITHOUT_STERILIZATION]: "Sans stérilisation",
  [AdoptionOption.FREE_DONATION]: "Don libre",
  [AdoptionOption.UNKNOWN]: "Inconnu",
};
