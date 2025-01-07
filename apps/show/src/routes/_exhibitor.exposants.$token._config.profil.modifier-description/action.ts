import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  description: zu
    .string()
    .trim()
    .max(512, "Veuillez entrer une description plus courte")
    .optional(),
});
