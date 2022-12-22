import { PickUpReason } from "@prisma/client";
import orderBy from "lodash.orderby";

export const PICK_UP_REASON_TRANSLATION: Record<PickUpReason, string> = {
  [PickUpReason.ABANDONMENT]: "Abandon",
  [PickUpReason.DECEASED_MASTER]: "Décès du propriétaire",
  [PickUpReason.MISTREATMENT]: "Maltraitance",
  [PickUpReason.STRAY_ANIMAL]: "Errance",
  [PickUpReason.OTHER]: "Autre raison",
};

export const SORTED_PICK_UP_REASON = orderBy(
  Object.values(PickUpReason),
  (pickUpReason) => PICK_UP_REASON_TRANSLATION[pickUpReason]
);
