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
