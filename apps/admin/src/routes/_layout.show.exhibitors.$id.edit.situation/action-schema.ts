import { Visibility } from "#show/visibility";
import { zu } from "@animeaux/zod-utils";

export const actionSchema = zu.object({
  isVisible: zu
    .nativeEnum(Visibility.Enum, {
      required_error: "Veuillez choisir une option",
    })
    .transform(Visibility.toBoolean),

  locationNumber: zu
    .string()
    .trim()
    .max(16, "Veuillez entrer un numéro plus court")
    .optional(),

  standNumber: zu
    .string()
    .trim()
    .max(16, "Veuillez entrer un numéro plus court")
    .optional(),
});
