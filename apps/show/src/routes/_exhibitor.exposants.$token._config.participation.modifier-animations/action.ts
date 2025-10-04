import { normalizeLineBreaks, zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  onStandAnimations: zu.preprocess(
    normalizeLineBreaks,
    zu
      .string()
      .trim()
      .max(256, "Veuillez entrer une description plus courte")
      .optional(),
  ),
});
