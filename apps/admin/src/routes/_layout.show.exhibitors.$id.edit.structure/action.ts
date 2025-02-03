import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  name: zu
    .string({ required_error: "Veuillez entrer un nom" })
    .trim()
    .min(1, "Veuillez entrer un nom")
    .max(64, "Veuillez entrer un nom plus court"),
});
