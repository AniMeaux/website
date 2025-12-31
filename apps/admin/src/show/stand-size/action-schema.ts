import { Visibility } from "#i/show/visibility.js";
import { zu } from "@animeaux/zod-utils";

export const actionSchema = zu.object({
  area: zu.coerce
    .number({ message: "Veuillez entrer une surface valide" })
    .min(0, "Veuillez entrer une surface positive"),

  isVisible: zu.nativeEnum(Visibility.Enum).transform(Visibility.toBoolean),

  label: zu
    .string({ required_error: "Veuillez entrer un label" })
    .trim()
    .min(1, "Veuillez entrer un label")
    .max(128, "Veuillez entrer un label plus court"),

  maxCount: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .int("Veuillez entrer un nombre entier")
    .min(0, "Veuillez entrer un nombre positif"),

  maxDividerCount: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .int("Veuillez entrer un nombre entier")
    .min(0, "Veuillez entrer un nombre positif"),

  maxPeopleCountAdditional: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .int("Veuillez entrer un nombre entier")
    .min(0, "Veuillez entrer un nombre positif"),

  maxPeopleCountIncluded: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .int("Veuillez entrer un nombre entier")
    .min(0, "Veuillez entrer un nombre positif"),

  maxTableCount: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .int("Veuillez entrer un nombre entier")
    .min(0, "Veuillez entrer un nombre positif"),

  priceForAssociations: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .min(0, "Veuillez entrer un nombre positif")
    .optional(),

  priceForServices: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .min(0, "Veuillez entrer un nombre positif")
    .optional(),

  priceForShops: zu.coerce
    .number({ message: "Veuillez entrer un nombre valide" })
    .min(0, "Veuillez entrer un nombre positif")
    .optional(),
});
