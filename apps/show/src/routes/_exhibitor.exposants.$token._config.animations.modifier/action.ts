import { zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  onStandAnimations: zu
    .string()
    .trim()
    .max(128, "Veuillez entrer une description plus courte")
    .optional(),
});
