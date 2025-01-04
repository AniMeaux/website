import type { IconName } from "#generated/icon";
import { ShowActivityField } from "@prisma/client";
import orderBy from "lodash.orderby";

export const ACTIVITY_FIELD_TRANSLATION: Record<ShowActivityField, string> = {
  [ShowActivityField.ACCESSORIES]: "Accessoires",
  [ShowActivityField.ALTERNATIVE_MEDICINE]: "Médecine douce",
  [ShowActivityField.ARTIST]: "Artiste",
  [ShowActivityField.ASSOCIATION]: "Association",
  [ShowActivityField.BEHAVIOR]: "Comportement",
  [ShowActivityField.CARE]: "Soins",
  [ShowActivityField.CITY]: "Mairie",
  [ShowActivityField.DRAWING]: "Illustration",
  [ShowActivityField.EDITING]: "Edition",
  [ShowActivityField.EDUCATION]: "Education",
  [ShowActivityField.FOOD]: "Alimentation",
  [ShowActivityField.PHOTOGRAPHER]: "Photographe",
  [ShowActivityField.SENSITIZATION]: "Sensibilisation",
  [ShowActivityField.SERVICES]: "Services",
  [ShowActivityField.TRAINING]: "Formation",
};

export const SORTED_ACTIVITY_FIELDS = orderBy(
  Object.values(ShowActivityField),
  (field) => ACTIVITY_FIELD_TRANSLATION[field],
);

export const ACTIVITY_FIELD_ICON: Record<
  ShowActivityField,
  { solid: IconName; light: IconName }
> = {
  [ShowActivityField.ACCESSORIES]: {
    light: "teddy-bear-light",
    solid: "teddy-bear-solid",
  },
  [ShowActivityField.ALTERNATIVE_MEDICINE]: {
    light: "hand-holding-heart-light",
    solid: "hand-holding-heart-solid",
  },
  [ShowActivityField.ARTIST]: {
    light: "palette-light",
    solid: "palette-solid",
  },
  [ShowActivityField.ASSOCIATION]: {
    light: "people-group-light",
    solid: "people-group-solid",
  },
  [ShowActivityField.BEHAVIOR]: {
    light: "shield-paw-light",
    solid: "shield-paw-solid",
  },
  [ShowActivityField.CARE]: {
    light: "heart-light",
    solid: "heart-solid",
  },
  [ShowActivityField.CITY]: {
    light: "school-light",
    solid: "school-solid",
  },
  [ShowActivityField.DRAWING]: {
    light: "pen-paintbrush-light",
    solid: "pen-paintbrush-solid",
  },
  [ShowActivityField.EDITING]: {
    light: "book-open-light",
    solid: "book-open-solid",
  },
  [ShowActivityField.EDUCATION]: {
    light: "shield-dog-light",
    solid: "shield-dog-solid",
  },
  [ShowActivityField.FOOD]: {
    light: "bowl-food-light",
    solid: "bowl-food-solid",
  },
  [ShowActivityField.PHOTOGRAPHER]: {
    light: "camera-light",
    solid: "camera-solid",
  },
  [ShowActivityField.SENSITIZATION]: {
    light: "comments-light",
    solid: "comments-solid",
  },
  [ShowActivityField.SERVICES]: {
    light: "badge-check-light",
    solid: "badge-check-solid",
  },
  [ShowActivityField.TRAINING]: {
    light: "file-certificate-light",
    solid: "file-certificate-solid",
  },
};

/**
 * Exhibitors with at least one of the follwing activity fields are limited to
 * small sized stands.
 */
export const SMALL_SIZED_STANDS_ACTIVITY_FIELDS = [
  ShowActivityField.ALTERNATIVE_MEDICINE,
  ShowActivityField.ASSOCIATION,
  ShowActivityField.BEHAVIOR,
  ShowActivityField.CITY,
  ShowActivityField.EDUCATION,
  ShowActivityField.SENSITIZATION,
  ShowActivityField.SERVICES,
  ShowActivityField.TRAINING,
];
