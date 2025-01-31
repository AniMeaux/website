import { ShowActivityField } from "@prisma/client";
import orderBy from "lodash.orderby";

export namespace ActivityField {
  export const Enum = ShowActivityField;
  export type Enum = ShowActivityField;

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
}
