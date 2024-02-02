import type { IconProps } from "#generated/icon";
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

export const PICK_UP_REASON_ICON: Record<PickUpReason, IconProps["id"]> = {
  [PickUpReason.ABANDONMENT]: "heart-crack",
  [PickUpReason.BIRTH]: "cake-candles",
  [PickUpReason.DECEASED_MASTER]: "cross",
  [PickUpReason.MISTREATMENT]: "siren-on",
  [PickUpReason.STRAY_ANIMAL]: "cat-tree",
  [PickUpReason.OTHER]: "circle-question",
};

export const SORTED_PICK_UP_REASON = orderBy(
  Object.values(PickUpReason),
  (pickUpReason) => PICK_UP_REASON_TRANSLATION[pickUpReason],
);
