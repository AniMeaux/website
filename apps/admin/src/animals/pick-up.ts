import type { IconName } from "#generated/icon";
import { PickUpReason } from "@animeaux/prisma/client";
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
  [PickUpReason.ABANDONMENT]: "icon-heart-crack-solid",
  [PickUpReason.BIRTH]: "icon-cake-candles-solid",
  [PickUpReason.DECEASED_MASTER]: "icon-cross-solid",
  [PickUpReason.MISTREATMENT]: "icon-siren-on-solid",
  [PickUpReason.STRAY_ANIMAL]: "icon-cat-tree-solid",
  [PickUpReason.OTHER]: "icon-circle-question-solid",
};

export const SORTED_PICK_UP_REASON = orderBy(
  Object.values(PickUpReason),
  (pickUpReason) => PICK_UP_REASON_TRANSLATION[pickUpReason],
);
