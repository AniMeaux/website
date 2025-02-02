import { Payment } from "#show/exhibitors/payment";
import { Visibility } from "#show/visibility";
import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  hasPaid: zu
    .nativeEnum(Payment.Enum, { required_error: "Veuillez choisir une option" })
    .transform(Payment.toBoolean),

  isVisible: zu
    .nativeEnum(Visibility.Enum, {
      required_error: "Veuillez choisir une option",
    })
    .transform(Visibility.toBoolean),

  locationNumber: zu.coerce
    .number({
      message: "Veuillez entrer un nombre valide",
    })
    .int({ message: "Veuillez entrer un nombre entier" })
    .min(1, "Veuillez entrer un nombre supérieur à 1")
    .optional(),

  standNumber: zu.coerce
    .number({
      message: "Veuillez entrer un nombre valide",
    })
    .int({ message: "Veuillez entrer un nombre entier" })
    .min(1, "Veuillez entrer un nombre supérieur à 1")
    .optional(),
});
