import { OnOff } from "#i/core/form-elements/field-on-off.js";
import { Visibility } from "#i/show/visibility";
import { zu } from "@animeaux/zod-utils";

export const actionSchema = zu.object({
  isOrganizer: zu
    .nativeEnum(OnOff.Enum, {
      required_error: "Veuillez choisir une option",
    })
    .transform(OnOff.toBoolean),

  isOrganizersFavorite: zu
    .nativeEnum(OnOff.Enum, {
      required_error: "Veuillez choisir une option",
    })
    .transform(OnOff.toBoolean),

  isRisingStar: zu
    .nativeEnum(OnOff.Enum, {
      required_error: "Veuillez choisir une option",
    })
    .transform(OnOff.toBoolean),

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
