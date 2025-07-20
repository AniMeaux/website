import { normalizeLineBreaks, zu } from "@animeaux/zod-utils";

export const ActionSchema = zu.object({
  description: zu.preprocess(
    normalizeLineBreaks,
    zu
      .string({ required_error: "Veuillez entrer une description" })
      .trim()
      .min(1, "Veuillez entrer une description")
      .max(512, "Veuillez entrer une description plus courte"),
  ),
});
