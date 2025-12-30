import type { IconName } from "#i/generated/icon";
import { ShowActivityField } from "@animeaux/prisma";
import orderBy from "lodash.orderby";

export namespace ActivityField {
  export const Enum = ShowActivityField;
  export type Enum = ShowActivityField;

  export const MAX_COUNT = 3;

  export const translation: Record<Enum, string> = {
    [Enum.ACCESSORIES]: "Accessoires",
    [Enum.ALTERNATIVE_MEDICINE]: "Médecine douce",
    [Enum.ARTIST]: "Artiste",
    [Enum.ASSOCIATION]: "Association",
    [Enum.BEHAVIOR]: "Comportement",
    [Enum.CARE]: "Soins",
    [Enum.CITY]: "Mairie",
    [Enum.DRAWING]: "Illustration",
    [Enum.EDITING]: "Edition",
    [Enum.EDUCATION]: "Education",
    [Enum.FOOD]: "Alimentation",
    [Enum.PHOTOGRAPHER]: "Photographe",
    [Enum.SENSITIZATION]: "Sensibilisation",
    [Enum.SERVICES]: "Services",
    [Enum.TRAINING]: "Formation",
  };

  export const values = orderBy(
    Object.values(Enum),
    (field) => translation[field],
  );

  export const icon: Record<Enum, { solid: IconName; light: IconName }> = {
    [Enum.ACCESSORIES]: {
      light: "teddy-bear-light",
      solid: "teddy-bear-solid",
    },
    [Enum.ALTERNATIVE_MEDICINE]: {
      light: "hand-holding-heart-light",
      solid: "hand-holding-heart-solid",
    },
    [Enum.ARTIST]: { light: "palette-light", solid: "palette-solid" },
    [Enum.ASSOCIATION]: {
      light: "people-group-light",
      solid: "people-group-solid",
    },
    [Enum.BEHAVIOR]: { light: "shield-paw-light", solid: "shield-paw-solid" },
    [Enum.CARE]: { light: "heart-light", solid: "heart-solid" },
    [Enum.CITY]: { light: "school-light", solid: "school-solid" },
    [Enum.DRAWING]: {
      light: "pen-paintbrush-light",
      solid: "pen-paintbrush-solid",
    },
    [Enum.EDITING]: { light: "book-open-light", solid: "book-open-solid" },
    [Enum.EDUCATION]: { light: "shield-dog-light", solid: "shield-dog-solid" },
    [Enum.FOOD]: { light: "bowl-food-light", solid: "bowl-food-solid" },
    [Enum.PHOTOGRAPHER]: { light: "camera-light", solid: "camera-solid" },
    [Enum.SENSITIZATION]: { light: "comments-light", solid: "comments-solid" },
    [Enum.SERVICES]: { light: "badge-check-light", solid: "badge-check-solid" },
    [Enum.TRAINING]: {
      light: "file-certificate-light",
      solid: "file-certificate-solid",
    },
  };
}
