import type { IconName } from "#generated/icon";
import { ShowActivityTarget } from "@prisma/client";
import orderBy from "lodash.orderby";

export const ACTIVITY_TARGET_TRANSLATION: Record<ShowActivityTarget, string> = {
  [ShowActivityTarget.CATS]: "Chats",
  [ShowActivityTarget.DOGS]: "Chiens",
  [ShowActivityTarget.EQUINES]: "Équidés",
  [ShowActivityTarget.HUMANS]: "Humains",
  [ShowActivityTarget.NACS]: "NACs",
  [ShowActivityTarget.RABBITS]: "Lapins",
  [ShowActivityTarget.WILDLIFE]: "Faune sauvage",
};

export const SORTED_ACTIVITY_TARGETS = orderBy(
  Object.values(ShowActivityTarget),
  (field) => ACTIVITY_TARGET_TRANSLATION[field],
);

export const ACTIVITY_TARGET_ICON: Record<
  ShowActivityTarget,
  { solid: IconName; light: IconName }
> = {
  [ShowActivityTarget.CATS]: {
    light: "cat-light",
    solid: "cat-solid",
  },
  [ShowActivityTarget.DOGS]: {
    light: "dog-light",
    solid: "dog-solid",
  },
  [ShowActivityTarget.EQUINES]: {
    light: "horse-light",
    solid: "horse-solid",
  },
  [ShowActivityTarget.HUMANS]: {
    light: "people-simple-light",
    solid: "people-simple-solid",
  },
  [ShowActivityTarget.NACS]: {
    light: "mouse-field-light",
    solid: "mouse-field-solid",
  },
  [ShowActivityTarget.RABBITS]: {
    light: "rabbit-light",
    solid: "rabbit-solid",
  },
  [ShowActivityTarget.WILDLIFE]: {
    light: "squirrel-light",
    solid: "squirrel-solid",
  },
};
