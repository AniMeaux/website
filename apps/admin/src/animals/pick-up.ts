import type { IconName } from "#generated/icon";
import { PickUpReason } from "@prisma/client";
import orderBy from "lodash.orderby";

export const PICK_UP_REASON_TRANSLATION: Record<PickUpReason, string> = {
  [PickUpReason.ABANDONMENT]: "Abandon",
  [PickUpReason.BIRTH]: "Naissance",
  [PickUpReason.DECEASED_MASTER]: "Décès du propriétaire",
  [PickUpReason.MISTREATMENT]: "Maltraitance",
  [PickUpReason.STRAY_ANIMAL]: "Errance",
  [PickUpReason.OTHER]: "Autre raison",
};

export const PICK_UP_REASON_ICON: Record<PickUpReason, IconName> = {
  [PickUpReason.ABANDONMENT]: "icon-heart-crack",
  [PickUpReason.BIRTH]: "icon-cake-candles",
  [PickUpReason.DECEASED_MASTER]: "icon-cross",
  [PickUpReason.MISTREATMENT]: "icon-siren-on",
  [PickUpReason.STRAY_ANIMAL]: "icon-cat-tree",
  [PickUpReason.OTHER]: "icon-circle-question",
};

export const SORTED_PICK_UP_REASON = orderBy(
  Object.values(PickUpReason),
  (pickUpReason) => PICK_UP_REASON_TRANSLATION[pickUpReason],
);
