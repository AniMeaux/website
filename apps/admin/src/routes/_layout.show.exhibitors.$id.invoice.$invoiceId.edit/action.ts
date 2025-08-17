import { InvoiceStatus } from "#show/invoice/status.js";
import { zu } from "@animeaux/zod-utils";

export const actionSchema = zu.object({
  amount: zu.coerce
    .number({ message: "Veuillez entrer un montant valide" })
    .min(0, "Veuillez entrer un montant positif"),

  dueDate: zu.coerce.date({
    required_error: "Veuillez entrer une date d’échéance",
    invalid_type_error: "Veuillez entrer une date d’échéance valide",
  }),

  number: zu
    .string({ required_error: "Veuillez entrer un numéro de facture" })
    .trim()
    .min(1, "Veuillez entrer un numéro de facture"),

  status: zu.nativeEnum(InvoiceStatus.Enum, {
    required_error: "Veuillez choisir un statut",
  }),

  url: zu
    .string({ required_error: "Veuillez entrer une URL" })
    .trim()
    .url("Veuillez entrer une URL valide"),
});
