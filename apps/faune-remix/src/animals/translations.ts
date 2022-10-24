import { AdoptionOption, PickUpReason } from "@prisma/client";

export const ADOPTION_OPTION_TRANSLATION: Record<AdoptionOption, string> = {
  [AdoptionOption.WITH_STERILIZATION]: "Avec stérilisation",
  [AdoptionOption.WITHOUT_STERILIZATION]: "Sans stérilisation",
  [AdoptionOption.FREE_DONATION]: "Don libre",
  [AdoptionOption.UNKNOWN]: "Inconnu",
};

export const PICK_UP_REASON_TRANSLATION: Record<PickUpReason, string> = {
  [PickUpReason.ABANDONMENT]: "Abandon",
  [PickUpReason.DECEASED_MASTER]: "Décès du propriétaire",
  [PickUpReason.MISTREATMENT]: "Maltraitance",
  [PickUpReason.STRAY_ANIMAL]: "Errance",
  [PickUpReason.OTHER]: "Autre raison",
};
