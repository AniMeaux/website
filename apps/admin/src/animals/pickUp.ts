import { PickUpReason } from "@prisma/client";
import orderBy from "lodash.orderby";
import { IconProps } from "~/generated/icon";

export const PICK_UP_REASON_TRANSLATION: Record<PickUpReason, string> = {
  [PickUpReason.ABANDONMENT]: "Abandon",
  [PickUpReason.DECEASED_MASTER]: "Décès du propriétaire",
  [PickUpReason.MISTREATMENT]: "Maltraitance",
  [PickUpReason.STRAY_ANIMAL]: "Errance",
  [PickUpReason.OTHER]: "Autre raison",
};

export const PICK_UP_REASON_ICON: Record<PickUpReason, IconProps["id"]> = {
  [PickUpReason.ABANDONMENT]: "heartCrack",
  [PickUpReason.DECEASED_MASTER]: "cross",
  [PickUpReason.MISTREATMENT]: "sirenOn",
  [PickUpReason.STRAY_ANIMAL]: "catTree",
  [PickUpReason.OTHER]: "circleQuestion",
};

export const SORTED_PICK_UP_REASON = orderBy(
  Object.values(PickUpReason),
  (pickUpReason) => PICK_UP_REASON_TRANSLATION[pickUpReason]
);
