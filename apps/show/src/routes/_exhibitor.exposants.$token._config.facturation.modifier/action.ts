import { zu } from "@animeaux/zod-utils";

export const actionSchema = zu.discriminatedUnion("sameAsStructure", [
  zu.object({
    // Conform doesn't coerse `zu.literal(true)`.
    sameAsStructure: zu.literal("on"),
    address: zu.undefined(),
    zipCode: zu.undefined(),
    city: zu.undefined(),
    country: zu.undefined(),
  }),
  zu.object({
    sameAsStructure: zu.literal("off").optional(),
    address: zu
      .string({ required_error: "Veuillez entrer une adresse" })
      .trim()
      .min(1, "Veuillez entrer une adresse")
      .max(128, "Veuillez entrer une adresse plus courte"),
    zipCode: zu
      .string({ required_error: "Veuillez entrer un code postal" })
      .trim()
      .regex(/^\d+$/, "Veuillez entrer un code postal valide")
      .max(64, "Veuillez entrer un code postal plus court"),
    city: zu
      .string({ required_error: "Veuillez entrer une ville" })
      .trim()
      .min(1, "Veuillez entrer une ville")
      .max(128, "Veuillez entrer une ville plus courte"),
    country: zu
      .string({ required_error: "Veuillez entrer un pays" })
      .trim()
      .min(1, "Veuillez entrer un pays")
      .max(64, "Veuillez entrer un pays plus court"),
  }),
]);
