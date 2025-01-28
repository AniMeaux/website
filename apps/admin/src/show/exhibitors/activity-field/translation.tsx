import { ShowActivityField } from "@prisma/client";

export const TRANSLATION_BY_ACTIVITY_FIELD: Record<ShowActivityField, string> =
  {
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
