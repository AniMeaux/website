import { AnimalGender, PickUpReason } from "@animeaux/shared";

export const ANIMAL_GENDER_LABELS: Record<AnimalGender, string> = {
  [AnimalGender.FEMALE]: "Femelle",
  [AnimalGender.MALE]: "Mâle",
};

export const PICK_UP_REASON_LABELS: Record<PickUpReason, string> = {
  [PickUpReason.ABANDONMENT]: "Abandon",
  [PickUpReason.BIRTH]: "Naissance",
  [PickUpReason.DECEASED_MASTER]: "Décès du propriétaire",
  [PickUpReason.MISTREATMENT]: "Maltraitance",
  [PickUpReason.STRAY_ANIMAL]: "Errance",
  [PickUpReason.OTHER]: "Autre raison",
};
